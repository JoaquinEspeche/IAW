'use client';

import React from 'react';
import { Globe, Server, Key, Sparkles, RefreshCw } from 'lucide-react';
import { Account } from '../types';

interface NavbarProps {
  accounts: Account[];
  selectedAccountId: string;
  onSelectAccount: (id: string) => void;
  isBackendConnected: boolean;
  onRunSeed: () => void;
  isSeeding: boolean;
  onRefresh: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  accounts,
  selectedAccountId,
  onSelectAccount,
  isBackendConnected,
  onRunSeed,
  isSeeding,
  onRefresh,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Globe className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
                  Crawler Engine
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider text-cyan-300 bg-cyan-950/80 border border-cyan-800/60 rounded-full uppercase">
                  Site Core
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Gestión de Sitios & Document Extractors</p>
            </div>
          </div>

          {/* Connection & Account Actions */}
          <div className="flex items-center gap-4">
            
            {/* Backend Status Pill */}
            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
              isBackendConnected
                ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300'
                : 'bg-amber-950/60 border-amber-800/60 text-amber-300'
            }`}>
              <Server className="w-3.5 h-3.5" />
              <span>{isBackendConnected ? 'NestJS Backend API Live' : 'Modo Demostración / Offline'}</span>
              <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            </div>

            {/* Account Switcher */}
            {accounts.length > 0 && (
              <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200">
                <Key className="w-3.5 h-3.5 text-purple-400 mr-2" />
                <select
                  value={selectedAccountId}
                  onChange={(e) => onSelectAccount(e.target.value)}
                  className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-2"
                >
                  <option value="" className="bg-slate-900 text-slate-200">Todas las Cuentas</option>
                  {accounts.map((acc) => (
                    <option key={acc._id} value={acc._id} className="bg-slate-900 text-slate-200">
                      {acc.name} ({acc.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Seed Demo Data Button */}
            <button
              onClick={onRunSeed}
              disabled={isSeeding}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all duration-200 disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>{isSeeding ? 'Cargando Seed...' : 'Cargar Seed Demo'}</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
