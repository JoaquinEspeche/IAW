'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Globe, Filter, Loader2, AlertTriangle, ServerOff } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { MetricsHeader } from '../components/MetricsHeader';
import { SiteCard } from '../components/SiteCard';
import { SiteModal } from '../components/SiteModal';
import { SiteDrawer } from '../components/SiteDrawer';
import { Site, Account, CreateSiteInput } from '../types';
import { sitesApi, accountsApi, snapshotsApi, documentsApi, seedApi, checkBackendHealth } from '../lib/api';

export default function HomePage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  // Totals for metrics
  const [totalSnapshots, setTotalSnapshots] = useState<number>(0);
  const [totalDocs, setTotalDocs] = useState<number>(0);

  // Modal & Drawer State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [inspectingSite, setInspectingSite] = useState<Site | null>(null);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setBackendError(null);

    // 1. Check backend health
    const healthy = await checkBackendHealth();
    setIsBackendConnected(healthy);

    if (!healthy) {
      setBackendError('No se pudo conectar con el backend NestJS en ' + (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') + '. Verificá que el servidor esté corriendo.');
      setIsLoading(false);
      return;
    }

    try {
      // 2. Fetch Accounts
      const accList = await accountsApi.getAll();
      setAccounts(accList);
      if (accList.length > 0) {
        setSelectedAccountId(prev => prev || accList[0]._id);
      }

      // 3. Fetch all Sites
      const siteList = await sitesApi.getAll();
      setSites(siteList);

      // 4. Compute aggregate stats (paralelo)
      const [snapResults, docResults] = await Promise.all([
        Promise.all(siteList.map(s => snapshotsApi.getBySite(s._id).catch(() => []))),
        Promise.all(siteList.map(s => documentsApi.getBySite(s._id).catch(() => []))),
      ]);

      setTotalSnapshots(snapResults.flat().length);
      setTotalDocs(docResults.flat().length);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setBackendError('Error al cargar datos: ' + msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadInitialData(); }, []);

  // Poll backend health every 10s
  useEffect(() => {
    const interval = setInterval(async () => {
      const healthy = await checkBackendHealth();
      if (healthy !== isBackendConnected) {
        setIsBackendConnected(healthy);
        if (healthy) loadInitialData();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isBackendConnected, loadInitialData]);

  const handleRunSeed = async () => {
    setIsSeeding(true);
    try {
      await seedApi.runSeed();
      await loadInitialData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert('Error ejecutando seed: ' + msg);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCreateSite = async (input: CreateSiteInput) => {
    const created = await sitesApi.create(input);
    setSites(prev => [created, ...prev]);
  };

  const handleUpdateSite = async (input: CreateSiteInput) => {
    if (!editingSite) return;
    const updated = await sitesApi.update(editingSite._id, input);
    setSites(prev => prev.map(s => s._id === updated._id ? updated : s));
    if (inspectingSite?._id === updated._id) setInspectingSite(updated);
  };

  const handleDeleteSite = async (siteId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este sitio web y sus datos asociados?')) return;
    await sitesApi.delete(siteId);
    setSites(prev => prev.filter(s => s._id !== siteId));
    if (inspectingSite?._id === siteId) setInspectingSite(null);
  };

  const handleTriggerCrawl = async (siteId: string) => {
    await snapshotsApi.triggerCrawl(siteId);
    setTotalSnapshots(prev => prev + 1);
  };

  // Filtered sites
  const filteredSites = sites.filter(site => {
    const matchesAccount = !selectedAccountId || site.accountId === selectedAccountId;
    const matchesQuery = !searchQuery ||
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAccount && matchesQuery;
  });

  const selectedAccountObj = accounts.find(a => a._id === selectedAccountId) || accounts[0] || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">

      <Navbar
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        onSelectAccount={setSelectedAccountId}
        isBackendConnected={isBackendConnected}
        onRunSeed={handleRunSeed}
        isSeeding={isSeeding}
        onRefresh={loadInitialData}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-400">
              Gestión de Sitios Web
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Configuración de web crawlers, extractores Cheerio JS y snapshots · Conectado a MongoDB Atlas
            </p>
          </div>

          <button
            onClick={() => { setEditingSite(null); setIsModalOpen(true); }}
            disabled={!isBackendConnected}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Sitio Web</span>
          </button>
        </div>

        {/* Backend Error Banner */}
        {backendError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-800/60 flex items-start gap-3">
            <ServerOff className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-300">Backend no disponible</p>
              <p className="text-xs text-red-400 mt-0.5">{backendError}</p>
              <p className="text-xs text-red-500 mt-2 font-mono">
                Asegurate de que NestJS esté corriendo: <span className="text-red-300">npm run start:dev</span>
              </p>
            </div>
          </div>
        )}

        {/* Metrics */}
        <MetricsHeader
          sites={sites}
          accounts={accounts}
          totalSnapshotsCount={totalSnapshots}
          totalDocumentsCount={totalDocs}
        />

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-6 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 backdrop-blur-sm">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por nombre o URL raíz..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 w-full sm:w-auto justify-end">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>{filteredSites.length} de {sites.length} sitios</span>
            <button
              onClick={loadInitialData}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors"
            >
              Actualizar
            </button>
          </div>
        </div>

        {/* Sites Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-sm font-semibold">Conectando con el backend y cargando datos...</p>
          </div>
        ) : !isBackendConnected ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-800 flex items-center justify-center">
              <ServerOff className="w-8 h-8 text-red-400" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-red-300">Sin conexión al backend</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Iniciá el servidor NestJS para ver los datos reales de MongoDB Atlas.
              </p>
            </div>
            <button
              onClick={loadInitialData}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700"
            >
              Reintentar conexión
            </button>
          </div>
        ) : filteredSites.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900/50 border border-slate-800 text-center my-8">
            <Globe className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-200">
              {sites.length === 0 ? 'No hay sitios registrados en la base de datos' : 'Ningún sitio coincide con tu búsqueda'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-6">
              {sites.length === 0
                ? 'La base de datos está vacía. Podés usar el botón "Cargar Seed Demo" para poblarla con datos de ejemplo, o crear un sitio manualmente.'
                : 'Probá con otro término de búsqueda o limpiá el filtro de cuenta.'}
            </p>
            {sites.length === 0 && (
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => { setEditingSite(null); setIsModalOpen(true); }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Sitio Web</span>
                </button>
                <button
                  onClick={handleRunSeed}
                  disabled={isSeeding}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700"
                >
                  {isSeeding ? 'Cargando...' : 'Cargar Seed Demo'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSites.map((site) => (
              <SiteCard
                key={site._id}
                site={site}
                onTriggerCrawl={handleTriggerCrawl}
                onInspect={(s) => setInspectingSite(s)}
                onEdit={(s) => { setEditingSite(s); setIsModalOpen(true); }}
                onDelete={handleDeleteSite}
              />
            ))}
          </div>
        )}

      </main>

      <footer className="w-full border-t border-slate-800/60 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>Microservicio de Crawling · NestJS + MongoDB Atlas · Next.js 14</p>
        <p className="mt-1 font-mono text-slate-600">
          Backend: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}
        </p>
      </footer>

      <SiteModal
        isOpen={isModalOpen}
        site={editingSite}
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingSite ? handleUpdateSite : handleCreateSite}
      />

      <SiteDrawer
        isOpen={!!inspectingSite}
        site={inspectingSite}
        account={selectedAccountObj}
        onClose={() => setInspectingSite(null)}
        onUpdateSite={(updated) => {
          setInspectingSite(updated);
          setSites(prev => prev.map(s => s._id === updated._id ? updated : s));
        }}
      />
    </div>
  );
}
