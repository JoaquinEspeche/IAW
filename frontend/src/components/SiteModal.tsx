'use client';

import React, { useState, useEffect } from 'react';
import { X, Code2, Globe, Clock, Sliders, Sparkles } from 'lucide-react';
import { Site, CreateSiteInput, Account } from '../types';

interface SiteModalProps {
  isOpen: boolean;
  site: Site | null;
  accounts: Account[];
  selectedAccountId: string;
  onClose: () => void;
  onSubmit: (data: CreateSiteInput) => Promise<void>;
}

const CHEERIO_EXTRACTOR_TEMPLATE = `function extract(request, response) {
  let $ = cheerio.load(response.body);
  return [{
    name: $('h1').first().text() || $('title').text() || 'Documento sin título',
    url: request.url,
    description: $('meta[name="description"]').attr('content') || $('p').first().text() || 'Sin descripción'
  }];
}`;

const CHEERIO_RESOLVER_TEMPLATE = `function pageResolver(request, response) {
  let $ = cheerio.load(response.body);
  let links = [];
  $('a[href]').each((i, el) => {
    let href = $(el).attr('href');
    if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
      links.push(href);
    }
  });
  return links;
}`;

export const SiteModal: React.FC<SiteModalProps> = ({
  isOpen,
  site,
  accounts,
  selectedAccountId,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CreateSiteInput>({
    accountId: selectedAccountId || (accounts[0]?._id || ''),
    name: '',
    url: 'https://',
    maxDepth: 2,
    frequency: '0 0 * * *',
    documentExtractor: CHEERIO_EXTRACTOR_TEMPLATE,
    pageResolver: CHEERIO_RESOLVER_TEMPLATE,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'extractors'>('general');

  useEffect(() => {
    if (site) {
      setFormData({
        accountId: site.accountId,
        name: site.name,
        url: site.url,
        maxDepth: site.maxDepth,
        frequency: site.frequency,
        documentExtractor: site.documentExtractor || CHEERIO_EXTRACTOR_TEMPLATE,
        pageResolver: site.pageResolver || CHEERIO_RESOLVER_TEMPLATE,
      });
    } else {
      setFormData({
        accountId: selectedAccountId || (accounts[0]?._id || ''),
        name: '',
        url: 'https://',
        maxDepth: 2,
        frequency: '0 0 * * *',
        documentExtractor: CHEERIO_EXTRACTOR_TEMPLATE,
        pageResolver: CHEERIO_RESOLVER_TEMPLATE,
      });
    }
  }, [site, selectedAccountId, accounts, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyPresetFrequency = (cron: string) => {
    setFormData(prev => ({ ...prev, frequency: cron }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                {site ? 'Editar Configuración de Sitio Web' : 'Registrar Nuevo Sitio Web'}
              </h2>
              <p className="text-xs text-slate-400">Parametriza las reglas de crawler y scripts Cheerio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'general'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Datos del Sitio & Frecuencia
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('extractors')}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'extractors'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Scripts Extractores JS (Cheerio)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {activeTab === 'general' ? (
            <div className="space-y-4">
              
              {/* Account selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Cuenta Propietaria</label>
                <select
                  value={formData.accountId}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountId: e.target.value }))}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {accounts.map(acc => (
                    <option key={acc._id} value={acc._id}>
                      {acc.name} ({acc.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Site Name & URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nombre Identificador</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Portal Documentación"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">URL Raíz a Inspeccionar</label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              {/* Max Depth slider */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span>Nivel Máximo de Profundidad (`maxDepth`)</span>
                  </label>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-xs font-mono font-bold border border-cyan-800">
                    Nivel {formData.maxDepth}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.maxDepth}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxDepth: parseInt(e.target.value) }))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 (Solo Homepage)</span>
                  <span>2 (Estándar)</span>
                  <span>3 (Profundo)</span>
                  <span>5 (Extenso)</span>
                </div>
              </div>

              {/* Frequency Cron */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Frecuencia Cron (`frequency`)</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => applyPresetFrequency('0 0 * * *')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700"
                  >
                    Diario (0 0 * * *)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetFrequency('0 */6 * * *')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700"
                  >
                    Cada 6 Horas
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetFrequency('0 * * * *')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700"
                  >
                    Cada Hora
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formData.frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Document Extractor JS */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Script Extractora JS (`documentExtractor`)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, documentExtractor: CHEERIO_EXTRACTOR_TEMPLATE }))}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Template Cheerio</span>
                  </button>
                </div>
                <textarea
                  rows={6}
                  required
                  value={formData.documentExtractor}
                  onChange={(e) => setFormData(prev => ({ ...prev, documentExtractor: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-emerald-400 font-mono focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

              {/* Page Resolver JS */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Script Resolutor de Links JS (`pageResolver`)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, pageResolver: CHEERIO_RESOLVER_TEMPLATE }))}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Template Resolver</span>
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={formData.pageResolver || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, pageResolver: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : site ? 'Guardar Cambios' : 'Crear Sitio Web'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
