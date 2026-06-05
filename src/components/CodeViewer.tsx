/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { odooModuleFiles } from '../odooCodeData';
import { OdooFile } from '../types';
import { Folder, FileCode, Copy, Check, Info, FileSpreadsheet, FileJson, ArrowRight } from 'lucide-react';

export default function CodeViewer() {
  const [selectedFile, setSelectedFile] = useState<OdooFile>(odooModuleFiles[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = {
    root: odooModuleFiles.filter(f => !f.path.includes('/') || f.path.startsWith('internal_asset_booking/__')),
    models: odooModuleFiles.filter(f => f.path.includes('models/')),
    security: odooModuleFiles.filter(f => f.path.includes('security/')),
    views: odooModuleFiles.filter(f => f.path.includes('views/')),
  };

  const getIcon = (lang: string) => {
    switch (lang) {
      case 'csv':
        return <FileSpreadsheet id="icon-csv" className="w-4 h-4 text-emerald-500" />;
      case 'xml':
        return <FileJson id="icon-xml" className="w-4 h-4 text-amber-500" />;
      default:
        return <FileCode id="icon-py" className="w-4 h-4 text-sky-500" />;
    }
  };

  return (
    <div id="code-viewer-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* File Tree Navigation Panel */}
      <div id="file-tree-panel" className="lg:col-span-4 bg-zinc-50 border border-zinc-200 rounded-2xl p-5 select-none text-xs">
        <h3 id="file-tree-title" className="text-xs font-bold uppercase tracking-widest text-[#714B67] mb-4 flex items-center gap-2">
          <Folder id="icon-folder" className="w-4 h-4 text-[#714B67]" />
          internal_asset_booking/
        </h3>

        <div id="file-tree-groups" className="space-y-4">
          {/* Root Level Module files */}
          <div id="group-root">
            <span id="label-root" className="text-[10px] font-mono tracking-widest font-extrabold text-zinc-400 uppercase px-2">Root Files</span>
            <div className="mt-1.5 space-y-1">
              {categories.root.map(file => (
                <button
                  key={file.path}
                  id={`file-btn-${file.filename}`}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 font-medium transition-all cursor-pointer ${
                    selectedFile.path === file.path
                      ? 'bg-zinc-900 text-white font-bold'
                      : 'text-zinc-600 hover:bg-zinc-150 hover:text-zinc-900'
                  }`}
                >
                  {getIcon(file.language)}
                  <span className="truncate">{file.filename}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Security Group */}
          <div id="group-security">
            <span id="label-security" className="text-[10px] font-mono tracking-widest font-extrabold text-zinc-400 uppercase px-2">Security</span>
            <div className="mt-1.5 space-y-1">
              {categories.security.map(file => (
                <button
                  key={file.path}
                  id={`file-btn-sec-${file.filename}`}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 font-medium transition-all cursor-pointer ${
                    selectedFile.path === file.path
                      ? 'bg-zinc-900 text-white font-bold'
                      : 'text-zinc-600 hover:bg-zinc-150 hover:text-zinc-900'
                  }`}
                >
                  {getIcon(file.language)}
                  <span className="truncate">{file.path.replace('internal_asset_booking/', '')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Models Group */}
          <div id="group-models">
            <span id="label-models" className="text-[10px] font-mono tracking-widest font-extrabold text-zinc-400 uppercase px-2">Models (Python DB)</span>
            <div className="mt-1.5 space-y-1">
              {categories.models.map(file => (
                <button
                  key={file.path}
                  id={`file-btn-mod-${file.filename}`}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 font-medium transition-all cursor-pointer ${
                    selectedFile.path === file.path
                      ? 'bg-zinc-900 text-white font-bold'
                      : 'text-zinc-600 hover:bg-zinc-150 hover:text-zinc-900'
                  }`}
                >
                  {getIcon(file.language)}
                  <span className="truncate">{file.path.replace('internal_asset_booking/', '')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Views Group */}
          <div id="group-views">
            <span id="label-views" className="text-[10px] font-mono tracking-widest font-extrabold text-zinc-400 uppercase px-2">Views (XML Interface)</span>
            <div className="mt-1.5 space-y-1">
              {categories.views.map(file => (
                <button
                  key={file.path}
                  id={`file-btn-view-${file.filename}`}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 font-medium transition-all cursor-pointer ${
                    selectedFile.path === file.path
                      ? 'bg-zinc-900 text-white font-bold'
                      : 'text-zinc-600 hover:bg-zinc-150 hover:text-zinc-900'
                  }`}
                >
                  {getIcon(file.language)}
                  <span className="truncate">{file.path.replace('internal_asset_booking/', '')}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Installation Tutorial Box */}
        <div id="setup-tutorial-box" className="mt-6 p-4 bg-zinc-100/60 border border-zinc-200 rounded-xl text-xs leading-relaxed text-zinc-500">
          <div className="flex items-center gap-1.5 text-zinc-805 font-bold mb-2 uppercase tracking-wide text-[10px] font-mono">
            <Info className="w-3.5 h-3.5 text-[#714B67]" />
            Cara Install di Odoo 17
          </div>
          <ol className="list-decimal pl-4.5 space-y-1.5 text-zinc-500 font-medium font-sans">
            <li>Copy folder <code className="text-[#714B67] select-all font-mono font-semibold">internal_asset_booking</code> ke direktori Odoo addons anda.</li>
            <li>Aktifkan <span className="text-zinc-805 font-bold">Developer Mode</span> di Settings Odoo.</li>
            <li>Buka menu <span className="text-zinc-805 font-bold">Apps</span> &gt; klik <span className="text-zinc-805 font-bold">Update Apps List</span>.</li>
            <li>Cari <code className="text-zinc-805 font-semibold font-mono">internal_asset_booking</code>, lalu klik <span className="text-[#00A09D] font-bold">Activate</span>.</li>
          </ol>
        </div>
      </div>

      {/* Code Display Area */}
      <div id="code-content-panel" className="lg:col-span-8 flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {/* Code Bar Header */}
        <div id="code-header-bar" className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex flex-wrap justify-between items-center gap-3">
          <div>
            <div id="selected-filepath" className="text-xs font-mono text-indigo-400 select-all">{selectedFile.path}</div>
            <p id="selected-file-desc" className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</p>
          </div>
          <button
            id="copy-code-btn"
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              copied
                ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy File
              </>
            )}
          </button>
        </div>

        {/* Real Code Body */}
        <div id="code-body-container" className="relative flex-1 max-h-[500px] overflow-y-auto p-4 font-mono text-xs text-slate-300 leading-relaxed select-text">
          <pre className="whitespace-pre">{selectedFile.content}</pre>
        </div>

        {/* Highlight Summary Details */}
        <div id="snippet-highlights-box" className="p-4 bg-slate-900 border-t border-slate-800">
          <h4 className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide flex items-center gap-1">
            <span>💡</span> Highlight Analisis Arsitektur
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {selectedFile.filename.includes('booking') && selectedFile.language === 'python' ? (
              <>
                Field <code className="text-indigo-400">asset_id</code> bertipe <code className="text-pink-500">Many2one</code> dipasangkan dengan 
                domain aktif agar peminjam hanya bisa memesan aset yang sedang aktif. 
                Validasi overlap dijalankan di tingkat backend menggunakan metode constraint <code className="text-amber-500">_check_overlapping_bookings()</code>, 
                menyediakan perlindungan transaksi konkurensi database 100% dari double booking.
              </>
            ) : selectedFile.filename.includes('booking') && selectedFile.language === 'xml' ? (
              <>
                Calendar View bertindak sebagai default menu view mode berkat penulisan urutan <code className="text-indigo-400">calendar,tree,form</code> pada 
                window action. Prosedur booking admin dirancang super cepat menggunakan attribute <code className="text-amber-500">quick_create="true"</code>, 
                menyelesaikan pesanan kalender instan dalam waktu kurang dari 5 detik.
              </>
            ) : selectedFile.filename.includes('manifest') ? (
              <>
                Dependensi disetel ke <code className="text-indigo-400">['base', 'mail']</code> untuk memungkinkan Odoo standard UI layout dan 
                fitur Chatter (Log aktivitas, pesan, follow-up peminjaman aset) langsung terpasang di bawah form view.
              </>
            ) : (
              <>
                Pemanfaatan struktur native Odoo 17 MVC (Model-View-Controller) yang kokoh demi memelihara performa SQL server dan kelancaran transisi user interface.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
