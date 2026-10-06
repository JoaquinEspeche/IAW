'use client';

import React from 'react';
import { Globe, Camera, FileText, Layers } from 'lucide-react';
import { Site, Account } from '../types';

interface MetricsHeaderProps {
  sites: Site[];
  accounts: Account[];
  totalSnapshotsCount: number;
  totalDocumentsCount: number;
}

export const MetricsHeader: React.FC<MetricsHeaderProps> = ({
  sites,
  accounts,
  totalSnapshotsCount,
  totalDocumentsCount,
}) => {
  const metrics = [
    {
      label: 'Sitios Web Registrados',
      value: sites.length,
      subtext: `${sites.filter(s => s.maxDepth >= 3).length} con inspección profunda`,
      icon: Globe,
      color: 'from-cyan-500 to-blue-600',
      shadow: 'shadow-cyan-500/10',
      badge: 'Entidad Principal',
    },
    {
      label: 'Cuentas Propietarias',
      value: accounts.length,
      subtext: accounts[0]?.name || 'Cuenta activa',
      icon: Layers,
      color: 'from-purple-500 to-indigo-600',
      shadow: 'shadow-purple-500/10',
      badge: 'API Keys',
    },
    {
      label: 'Snapshots / Crawl Jobs',
      value: totalSnapshotsCount,
      subtext: 'Ejecuciones realizadas',
      icon: Camera,
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/10',
      badge: 'Histórico',
    },
    {
      label: 'Documentos Indexados',
      value: totalDocumentsCount,
      subtext: 'Extraídos por Cheerio',
      icon: FileText,
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/10',
      badge: 'Full-Text Search',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {metrics.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 backdrop-blur-sm hover:border-slate-700/80 transition-all duration-300 shadow-lg group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50">
                {item.badge}
              </span>
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} p-0.5 ${item.shadow}`}>
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-200" />
                </div>
              </div>
            </div>

            <div>
              <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
                {item.value}
              </div>
              <div className="text-xs font-medium text-slate-300 mt-1">
                {item.label}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                {item.subtext}
              </div>
            </div>

            {/* Subtle glow background */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          </div>
        );
      })}
    </div>
  );
};
