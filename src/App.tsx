/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import OdooSimulator from './components/OdooSimulator';
import CodeViewer from './components/CodeViewer';
import ConstraintVisualizer from './components/ConstraintVisualizer';
import { OrmLog } from './types';
import { 
  Terminal, 
  Code2, 
  Layers, 
  HelpCircle, 
  BookOpen, 
  Database, 
  Trash2, 
  ExternalLink,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

const BOOTSTRAP_LOGS: OrmLog[] = [
  { id: 'boot-1', timestamp: '06:00:00', type: 'success', message: 'Odoo 17.0 Server initialized successfully on port 3000.' },
  { id: 'boot-2', timestamp: '06:00:01', type: 'info', message: 'Loading custom addons path directory: addons/internal_asset_booking' },
  { id: 'boot-3', timestamp: '06:00:01', type: 'info', message: 'Module internal_asset_booking: manifest loaded & successfully validated.' },
  { id: 'boot-4', timestamp: '06:00:02', type: 'success', message: 'PostgreSQL connection: Bound database tables (asset_master, asset_booking) with composite indexes.' },
  { id: 'boot-5', timestamp: '06:00:02', type: 'info', message: 'Security ACL Registry: ir.model.access.csv successfully applied full read/write rights to base.group_user.' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'visualizer'>('simulator');
  const [logs, setLogs] = useState<OrmLog[]>(BOOTSTRAP_LOGS);
  const [isConsoleExpanded, setIsConsoleExpanded] = useState(true);

  // Appends a new server log triggered by client workflows
  const handleLogTriggered = (newLog: OrmLog) => {
    setLogs(prev => [newLog, ...prev]);
  };

  const clearLogs = () => {
    setLogs([
      { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), type: 'info', message: 'System console cleared by Admin.' }
    ]);
  };

  return (
    <div id="root-layout" className="min-h-screen bg-zinc-50/50 flex flex-col justify-between font-sans minimal-grid-bg">
      
      {/* Executive Header Branding banner in Clean Minimalism style */}
      <div id="workbench-header" className="bg-white border-b border-zinc-200 text-zinc-900 py-6 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Title Branding */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[var(--color-odoo-purple)] text-white font-extrabold text-[10px] px-2.5 py-1 rounded-md tracking-wider">ODOO v17Addon</span>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-bold">Standard Architecture</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 font-display">
              Asset Booking Custom Module
            </h1>
            <p className="text-xs text-zinc-500 max-w-2xl">
              Rancang dan uji modul Odoo 17 <code className="bg-zinc-100 text-zinc-800 font-mono px-1.5 py-0.5 rounded border border-zinc-200">internal_asset_booking</code> secara standalone. 
              Sistem ini memfasilitasi pencarian overlap waktu sirkular berkinerja tinggi, visualisasi log RPC, dan file XML/Python yang siap pakai.
            </p>
          </div>

          {/* Tab Selection Navigation Header with pristine minimal aesthetics */}
          <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200/80 self-start lg:self-center">
            <button
              id="tab-btn-simulator"
              onClick={() => setActiveTab('simulator')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'simulator'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Odoo UI Simulator
            </button>

            <button
              id="tab-btn-code"
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'code'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Source Code Files
            </button>

            <button
              id="tab-btn-visualizer"
              onClick={() => setActiveTab('visualizer')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'visualizer'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              ORM Constraints Visualizer
            </button>
          </div>
        </div>
      </div>

      {/* Main Container Content */}
      <main id="workbench-body" className="max-w-7xl w-full mx-auto p-4 lg:p-8 flex-1 pb-48">
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            {/* Quick Context Banner with minimal high-contrast borders */}
            <div className="bg-white text-zinc-800 rounded-2xl p-6 border border-zinc-200/80 text-xs lg:text-sm leading-relaxed shadow-2xs">
              <h2 className="font-bold text-sm lg:text-base text-zinc-900 mb-1.5 flex items-center gap-2">
                <span>⚡</span> Sistem Peminjaman Aset Standalone Odoo 17
              </h2>
              <p className="text-zinc-500">
                Penciptaan modul didasarkan sepenuhnya pada native Odoo ORM yang efisien. 
                Tampilan Kalender di bawah ini merupakan <strong>default view mode</strong> yang melayani <strong>quick-create</strong>. 
                Klik tanggal kosong pada kalender untuk memicu form booking otomatis, atau edit reservasi untuk menguji sistem validasi overlap datetime secara langsung.
              </p>
            </div>
            
            <OdooSimulator onLogTriggered={handleLogTriggered} />
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-4">
            <div className="bg-white border border-zinc-200 text-zinc-800 p-5 rounded-2xl text-xs flex gap-3">
              <BookOpen className="w-5 h-5 shrink-0 text-zinc-500" />
              <div>
                <span className="font-bold text-zinc-900">Arsitektur Modul Odoo 17 Terstruktur</span>
                <p className="mt-0.5 text-zinc-500">
                  Berikut adalah struktur pohon kode yang siap diinstall ke server Odoo Anda. Seluruh file model didefinisikan 
                  sesuai dengan konvensi penamaan framework Odoo, siap disalin untuk diletakkan di dalam folder <code>addons</code>.
                </p>
              </div>
            </div>
            <CodeViewer />
          </div>
        )}

        {activeTab === 'visualizer' && (
          <ConstraintVisualizer />
        )}
      </main>

      {/* Interactive Server Terminal Logs Drawer (Fixed at bottom) */}
      <footer id="developer-terminal-drawer" className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 shadow-2xl z-40">
        
        {/* Console Header Selector bar */}
        <div id="console-header" className="bg-slate-900 px-4 lg:px-8 py-2.5 flex items-center justify-between border-b border-slate-800 select-none">
          <button 
            onClick={() => setIsConsoleExpanded(!isConsoleExpanded)}
            className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300"
          >
            <Terminal className="w-4 h-4" />
            Odoo Server RPC Console Logs
            {isConsoleExpanded ? <ChevronDown className="w-3.5 h-3.5 ml-1" /> : <ChevronUp className="w-3.5 h-3.5 ml-1" />}
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={clearLogs}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[10px] uppercase font-bold tracking-wider rounded transition-colors"
            >
              Clear Output
            </button>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden sm:inline">Active Thread Listening</span>
          </div>
        </div>

        {/* Console Logs Stream */}
        {isConsoleExpanded && (
          <div id="console-logs-stream" className="h-32 overflow-y-auto px-4 lg:px-8 py-3 font-mono text-[10px] md:text-xs text-slate-300 leading-relaxed space-y-2 bg-slate-950/90 select-text">
            {logs.length === 0 ? (
              <span className="text-slate-600 block italic">Listening for RPC dataset/call_button triggers...</span>
            ) : (
              logs.map(log => {
                let colorClass = 'text-sky-400';
                if (log.type === 'success') colorClass = 'text-emerald-400 font-bold';
                if (log.type === 'warning') colorClass = 'text-amber-400 font-semibold';
                if (log.type === 'error') colorClass = 'text-rose-400 font-bold';

                return (
                  <div key={log.id} className="border-b border-slate-900 pb-1.5">
                    <div className="flex flex-wrap items-start md:items-center gap-1.5 md:gap-2">
                      <span className="text-slate-600 font-normal select-none">[{log.timestamp}]</span>
                      <span className={`uppercase font-extrabold tracking-wider text-[9px] px-1 py-0.5 rounded bg-slate-900 ${colorClass}`}>
                        {log.type}
                      </span>
                      <span className="text-slate-300 flex-1 leading-snug">{log.message}</span>
                    </div>
                    {log.details && (
                      <div className="pl-6 md:pl-16 mt-1 text-slate-500 whitespace-pre overflow-x-auto text-[9px] md:text-[11px] leading-relaxed">
                        {log.details}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </footer>
    </div>
  );
}
