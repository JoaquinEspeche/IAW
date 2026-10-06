'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Globe,
  Camera,
  FileText,
  Search,
  Code2,
  Play,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Save,
} from 'lucide-react';
import { Site, Snapshot, ExtractedDocument, SearchResult, Account } from '../types';
import { snapshotsApi, documentsApi, searchApi, sitesApi } from '../lib/api';

interface SiteDrawerProps {
  site: Site | null;
  account: Account | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSite: (site: Site) => void;
}

export const SiteDrawer: React.FC<SiteDrawerProps> = ({
  site,
  account,
  isOpen,
  onClose,
  onUpdateSite,
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'snapshots' | 'documents' | 'search'>('snapshots');
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [documents, setDocuments] = useState<ExtractedDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
  const [isLoadingSnapshots, setIsLoadingSnapshots] = useState(false);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);

  // Extractor edit state inside workspace
  const [extractorJs, setExtractorJs] = useState('');
  const [resolverJs, setResolverJs] = useState('');
  const [isSavingCode, setIsSavingCode] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (site && isOpen) {
      setExtractorJs(site.documentExtractor || '');
      setResolverJs(site.pageResolver || '');
      loadSnapshots();
      loadDocuments();
    }
  }, [site, isOpen]);

  if (!isOpen || !site) return null;

  const loadSnapshots = async () => {
    setIsLoadingSnapshots(true);
    try {
      const data = await snapshotsApi.getBySite(site._id);
      setSnapshots(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingSnapshots(false);
    }
  };

  const loadDocuments = async () => {
    setIsLoadingDocs(true);
    try {
      const data = await documentsApi.getBySite(site._id);
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const handleTriggerCrawl = async () => {
    setIsTriggering(true);
    try {
      await snapshotsApi.triggerCrawl(site._id);
      await loadSnapshots();
      await loadDocuments();
    } catch (err) {
      console.error(err);
    } finally {
      setIsTriggering(false);
    }
  };

  const handleSaveExtractorCode = async () => {
    setIsSavingCode(true);
    try {
      const updated = await sitesApi.update(site._id, {
        documentExtractor: extractorJs,
        pageResolver: resolverJs,
      });
      onUpdateSite(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingCode(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const apiKey = account?.apiKey || 'ak_live_demo';
      const results = await searchApi.search(searchQuery, apiKey);
      // Filter results for this site if present
      const filtered = results.filter(r => r.siteId === site._id || !r.siteId);
      setSearchResults(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">{site.name}</h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Depth: {site.maxDepth}
                </span>
              </div>
              <a
                href={site.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 mt-0.5 font-mono"
              >
                <span>{site.url}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerCrawl}
              disabled={isTriggering}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              {isTriggering ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Play className="w-4 h-4 fill-white/20" />
              )}
              <span>{isTriggering ? 'Disparando...' : 'Ejecutar Crawl'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6">
          <button
            onClick={() => setActiveTab('snapshots')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'snapshots'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Snapshots & Jobs ({snapshots.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'documents'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Documentos Extraídos ({documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'config'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Scripts Cheerio JS</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'search'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search Sandbox</span>
          </button>
        </div>

        {/* Workspace Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: SNAPSHOTS */}
          {activeTab === 'snapshots' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200">Histórico de Snapshots Capturados</h3>
                <span className="text-xs text-slate-400">Ordenado por más reciente</span>
              </div>

              {isLoadingSnapshots ? (
                <div className="flex items-center justify-center py-12 text-slate-400 text-xs">
                  <Loader2 className="w-5 h-5 animate-spin mr-2 text-cyan-400" />
                  <span>Cargando snapshots de sitio...</span>
                </div>
              ) : snapshots.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                  <Camera className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-300 text-sm font-semibold">Sin Snapshots Ejecutados</p>
                  <p className="text-slate-400 text-xs mt-1 mb-4">Aún no se ha realizado ninguna captura sobre este sitio.</p>
                  <button
                    onClick={handleTriggerCrawl}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                  >
                    Disparar Primer Snapshot
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {snapshots.map((snap) => (
                    <div
                      key={snap._id}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-slate-200 font-bold">{snap._id}</span>
                            <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                              {snap.status}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 block mt-0.5">
                            Iniciado: {new Date(snap.startedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-mono font-bold text-cyan-300 block">
                          {snap.extractedDocumentsCount} docs
                        </span>
                        <span className="text-[11px] text-slate-400">Extraídos</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200">Documentos Parseados e Indizados</h3>
                <span className="text-xs text-slate-400">{documents.length} documentos totales</span>
              </div>

              {isLoadingDocs ? (
                <div className="flex items-center justify-center py-12 text-slate-400 text-xs">
                  <Loader2 className="w-5 h-5 animate-spin mr-2 text-cyan-400" />
                  <span>Cargando documentos del sitio...</span>
                </div>
              ) : documents.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-300 text-sm font-semibold">Sin Documentos Extraídos</p>
                  <p className="text-slate-400 text-xs mt-1">Dispara un crawl para ejecutar el script `documentExtractor` Cheerio.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {documents.map((doc) => (
                    <div
                      key={doc._id}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm text-slate-100">{doc.title}</h4>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline text-xs flex items-center gap-1 font-mono shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2">{doc.description}</p>
                      <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-mono text-cyan-400/80">{doc.url}</span>
                        <span>Snap: {doc.snapshotId}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONFIG & SCRIPTS */}
          {activeTab === 'config' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-200">Editor de Scripts Cheerio JS</h3>
                  <p className="text-xs text-slate-400">Modifica la lógica de extracción en tiempo real</p>
                </div>

                <button
                  onClick={handleSaveExtractorCode}
                  disabled={isSavingCode}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-all disabled:opacity-50"
                >
                  {isSavingCode ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{isSavingCode ? 'Guardando...' : 'Guardar Scripts'}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">`documentExtractor` (Cheerio Parser)</label>
                <textarea
                  rows={8}
                  value={extractorJs}
                  onChange={(e) => setExtractorJs(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-emerald-400 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">`pageResolver` (Link Finder)</label>
                <textarea
                  rows={6}
                  value={resolverJs}
                  onChange={(e) => setResolverJs(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {/* TAB 4: SEARCH SANDBOX */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-200 mb-1">Probador de Búsqueda Full-Text MongoDB</h3>
                <p className="text-xs text-slate-400">Busca palabras clave en los documentos parseados usando tu API Key de cuenta</p>
              </div>

              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Escribe una palabra clave (ej. guía, arquitectura, sensor)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-2"
                >
                  {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  <span>Buscar</span>
                </button>
              </form>

              {/* Search Results */}
              <div className="space-y-3">
                {searchResults.length > 0 ? (
                  searchResults.map((res) => (
                    <div key={res._id} className="p-4 rounded-xl bg-slate-950/60 border border-cyan-900/50">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm text-cyan-300">{res.title}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400">
                          Score: {res.score?.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{res.description}</p>
                      <a href={res.url} target="_blank" rel="noreferrer" className="text-[11px] text-cyan-400 underline font-mono mt-2 block">
                        {res.url}
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    {searchQuery ? 'Sin coincidencias encontradas para tu consulta.' : 'Ingresa un término de búsqueda para probar el índice full-text.'}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
