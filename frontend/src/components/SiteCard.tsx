'use client';

import React, { useState } from 'react';
import {
  Globe,
  Play,
  Edit,
  Trash2,
  ExternalLink,
  Code2,
  Clock,
  ChevronRight,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { Site } from '../types';

interface SiteCardProps {
  site: Site;
  onTriggerCrawl: (siteId: string) => Promise<void>;
  onInspect: (site: Site) => void;
  onEdit: (site: Site) => void;
  onDelete: (siteId: string) => void;
}

export const SiteCard: React.FC<SiteCardProps> = ({
  site,
  onTriggerCrawl,
  onInspect,
  onEdit,
  onDelete,
}) => {
  const [isTriggering, setIsTriggering] = useState(false);
  const [justTriggered, setJustTriggered] = useState(false);

  const handleTrigger = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTriggering(true);
    try {
      await onTriggerCrawl(site._id);
      setJustTriggered(true);
      setTimeout(() => setJustTriggered(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <div className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 flex flex-col justify-between overflow-hidden">
      
      {/* Top section */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base group-hover:text-cyan-300 transition-colors line-clamp-1">
                {site.name}
              </h3>
              <a
                href={site.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-cyan-400/90 hover:text-cyan-300 flex items-center gap-1 hover:underline font-mono"
              >
                <span>{site.url}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 whitespace-nowrap">
            Depth: {site.maxDepth}
          </span>
        </div>

        {/* Badges / Tech Specs */}
        <div className="grid grid-cols-2 gap-2 my-4 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block">Frecuencia Cron</span>
              <span className="font-mono text-slate-200">{site.frequency}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 text-slate-300">
            <Code2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block">Extractor JS</span>
              <span className="font-mono text-slate-200">Cheerio DOM</span>
            </div>
          </div>
        </div>

        {/* Extractor Snippet Preview */}
        <div className="mb-4 p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 overflow-hidden line-clamp-2">
          <span className="text-purple-400">function</span> <span className="text-cyan-300">extract</span>(req, res) &#123; ... &#125;
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          
          {/* Trigger Crawl Button */}
          <button
            onClick={handleTrigger}
            disabled={isTriggering}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              justTriggered
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
            }`}
            title="Disparar Snapshot / Crawling manual"
          >
            {isTriggering ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            ) : justTriggered ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
            )}
            <span>{isTriggering ? 'Iniciando...' : justTriggered ? 'Snapshot Listo!' : 'Crawl Now'}</span>
          </button>

          {/* Edit Button */}
          <button
            onClick={() => onEdit(site)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-700 transition-colors"
            title="Editar Configuración"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(site._id)}
            className="p-1.5 rounded-lg hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-transparent hover:border-rose-900/50 transition-colors"
            title="Eliminar Sitio"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Workspace Details Trigger */}
        <button
          onClick={() => onInspect(site)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
        >
          <span>Workspace</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
};
