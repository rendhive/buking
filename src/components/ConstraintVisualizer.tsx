/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, ShieldAlert, Cpu, CheckCircle, BarChart3, HelpCircle } from 'lucide-react';

export default function ConstraintVisualizer() {
  const [testAssetId, setTestAssetId] = useState('1');
  const [testStart, setTestStart] = useState('2026-06-05T10:00');
  const [testEnd, setTestEnd] = useState('2026-06-05T14:00');
  const [evaluationResult, setEvaluationResult] = useState<{
    status: 'success' | 'overlap';
    message: string;
    sql: string;
    domain: string;
  } | null>(null);

  const simulateDbCheck = () => {
    // Standard mock database array representing existing reservations
    const existingBookings = [
      { id: 1, asset_id: 1, borrower: 'Budi Santoso', start: '2026-06-05T09:00', end: '2026-06-05T12:00' },
      { id: 2, asset_id: 5, borrower: 'Siti Rahma', start: '2026-06-05T13:00', end: '2026-06-05T17:30' },
      { id: 3, asset_id: 1, borrower: 'Ahmad Faisal', start: '2026-06-06T10:00', end: '2026-06-06T12:30' }
    ];

    const startMs = new Date(testStart).getTime();
    const endMs = new Date(testEnd).getTime();
    const targetAssetId = Number(testAssetId);

    // Odoo search domain representation
    const domain = `[
    ('asset_id', '=', ${testAssetId}),
    ('id', '!=', self.id),
    ('start_datetime', '<', '${testEnd}'),
    ('end_datetime', '>', '${testStart}'),
    ('state', '!=', 'cancelled')
]`;

    // SQL translation block
    const sql = `SELECT COUNT(*) 
FROM asset_booking 
WHERE asset_id = ${testAssetId} 
  AND id IS DISTINCT FROM NULL 
  AND start_datetime < '${testEnd.replace('T', ' ')}:00' 
  AND end_datetime > '${testStart.replace('T', ' ')}:00'
  AND state != 'cancelled';`;

    if (startMs >= endMs) {
      setEvaluationResult({
        status: 'overlap',
        message: 'ER_ERROR: ValidationError! Waktu Mulai harus lebih awal daripada Waktu Selesai!',
        sql,
        domain
      });
      return;
    }

    // Determine overlaps
    const collisions = existingBookings.filter(b => {
      if (b.asset_id !== targetAssetId) return false;
      const bStart = new Date(b.start).getTime();
      const bEnd = new Date(b.end).getTime();
      return bStart < endMs && bEnd > startMs;
    });

    if (collisions.length > 0) {
      const firstConflict = collisions[0];
      setEvaluationResult({
        status: 'overlap',
        message: `CONFLICT DETECTED! Aset sudah dipesan oleh '${firstConflict.borrower}' pada rentang jadwal [${firstConflict.start.replace('T', ' ')} s.d ${firstConflict.end.replace('T', ' ')}].`,
        sql,
        domain
      });
    } else {
      setEvaluationResult({
        status: 'success',
        message: 'VALIDASI LOLOS! Jadwal tersedia dan aman untuk dibooking (Count = 0).',
        sql,
        domain
      });
    }
  };

  return (
    <div id="vis-container" className="space-y-8 text-xs lg:text-sm">
      
      {/* Dynamic Simulator Playground Card */}
      <div id="playground-card" className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-3xs">
        <h3 id="playground-purity-title" className="text-sm font-bold text-zinc-900 mb-2 flex items-center gap-2">
          <Database className="w-4.5 h-4.5 text-[#00A09D]" />
          Playground Validasi Overlap ORM
        </h3>
        <p className="text-xs text-zinc-500 mb-5 leading-relaxed">
          Uji skenario datetime peminjaman di bawah ini untuk melihat bagaimana database memproses overlapping secara realtime menggunakan query yang efisien.
        </p>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs text-slate-500 block mb-1">Aset Target</label>
            <select
              value={testAssetId}
              onChange={(e) => setTestAssetId(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs font-bold text-zinc-800 focus:border-zinc-500 outline-none"
            >
              <option value="1">Ruangan 1 (Sedang Terisi 09:00 - 12:00)</option>
              <option value="5">Mobil 1 (Sedang Terisi 13:00 - 17:30)</option>
              <option value="2">Ruangan 2</option>
              <option value="3">Ruangan 3</option>
              <option value="4">Ruangan 4</option>
              <option value="6">Mobil 2</option>
              <option value="7">Mobil 3</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-500 block mb-1">Tes Waktu Mulai</label>
            <input
              type="datetime-local"
              value={testStart}
              onChange={(e) => setTestStart(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 p-2 rounded-xl text-xs font-bold text-zinc-800 focus:border-zinc-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 block mb-1">Tes Waktu Selesai</label>
            <input
              type="datetime-local"
              value={testEnd}
              onChange={(e) => setTestEnd(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 p-2 rounded-xl text-xs font-bold text-zinc-800 focus:border-zinc-500 outline-none"
            />
          </div>
        </div>

        <button
          onClick={simulateDbCheck}
          className="w-full bg-[var(--color-odoo-teal)] hover:bg-[var(--color-odoo-teal-hover)] text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-3xs cursor-pointer shadow-sm"
        >
          Jalankan Simulasi Overlap Check
        </button>

        {/* Simulated Diagnostic Output */}
        {evaluationResult && (
          <div className="mt-5 p-4 border border-zinc-200 rounded-xl bg-zinc-50 font-mono space-y-4">
            
            {/* Status Panel Banner */}
            <div className={`p-3 rounded-xl flex items-start gap-2.5 border ${
              evaluationResult.status === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {evaluationResult.status === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <ShieldAlert className="w-5 h-5 shrink-0" />}
              <div className="text-xs">
                <div className="font-bold uppercase tracking-wider text-[10px]">Result Odoo Constraint Handler</div>
                <p className="mt-1 leading-snug">{evaluationResult.message}</p>
              </div>
            </div>

            {/* Odoo domain box */}
            <div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1.5 font-mono">Odoo Engine RPC Search Domain ({'['}Python{']'})</div>
              <pre className="bg-zinc-900 text-pink-200 p-4 rounded-xl overflow-x-auto text-[11px] leading-relaxed select-all font-mono border border-zinc-950/20">{evaluationResult.domain}</pre>
            </div>

            {/* SQL Translation */}
            <div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1.5 font-mono">Kompilasi PostgreSQL Native ({'['}SQL{']'})</div>
              <pre className="bg-zinc-900 text-teal-250 p-4 rounded-xl overflow-x-auto text-[11px] leading-relaxed select-all font-mono border border-zinc-950/20">{evaluationResult.sql}</pre>
            </div>
          </div>
        )}
      </div>

      {/* memory efficiency analysis banner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Memory comparison explanation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-300">
          <h3 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
            <Cpu className="w-4.5 h-4.5 text-amber-400" />
            ORM Performance: <code className="text-indigo-400 text-xs">search_count()</code> vs <code className="text-pink-400 text-xs">search()</code>
          </h3>

          <div className="space-y-4 text-xs leading-relaxed">
            <p>
              Dalam Odoo, melakukan pertimbangan performa query adalah pembeda utama antara kode Junior dan arsitektur Senior. 
              Berikut adalah komparasi mengapa menggunakan <code className="text-indigo-300 font-mono">search_count()</code> jauh lebih efisien:
            </p>

            <div className="space-y-3 pt-3">
              {/* Box 1 */}
              <div className="border border-slate-800 p-3 rounded-lg bg-slate-950/40">
                <span className="text-pink-400 font-bold block mb-1">Metode Buruk: self.env['...'].search(domain)</span>
                <p className="text-slate-500">
                  Instruksi ini akan menarik <span className="text-slate-300 font-semibold">seluruh record</span> (beserta seluruh array kolom database), 
                  menginisiasi Odoo ActiveRecord object, lalu memasukkannya ke dalam Odoo local cache. 
                  Jika terdapat ribuan booking aktif, RAM server akan membengkak drastis hanya untuk sekadar memvalidasi overlap!
                </p>
              </div>

              {/* Box 2 */}
              <div className="border border-slate-800 p-3 rounded-lg bg-slate-950/40">
                <span className="text-indigo-400 font-bold block mb-1">Metode Rekomendasi/Senior: search_count(domain)</span>
                <p className="text-slate-500">
                  Metode ini menginstruksikan PostgreSQL di bawah untuk melangsungkan fungsi kalkulasi agregat di tingkat database. 
                  Tidak ada inisiasi object Python, tidak ada sirkulasi pemborosan cache memori, server hanya menerima balasan integer ringan 
                  (contoh: <code className="text-slate-300">0</code> atau <code className="text-slate-300">1</code>). Beban memori: <strong className="text-indigo-400">0.02 MB vs 15.4 MB</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* visual representation of database indexes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-300 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-slate-100 mb-2 flex items-center gap-2">
              <BarChart3 className="w-4.5 h-4.5 text-indigo-400" />
              Optimalisasi Index Database
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Agar query pencarian overlap tumpang-tindih waktu berjalan konstan di dalam mili-detik (O(1) / O(log n)), 
              maka PostgreSQL membutuhkan rancangan indeks komposit sebagai berikut:
            </p>

            {/* database visual table representation */}
            <div className="border border-slate-800 bg-slate-950 rounded-xl p-3 font-mono text-[11px] text-slate-400 space-y-2">
              <span className="text-amber-500 font-bold text-xs uppercase block tracking-wider">PostgreSQL Composite Index Planning</span>
              <code className="text-indigo-300 block select-all">
                CREATE INDEX idx_asset_booking_dates ON asset_booking (asset_id, start_datetime, end_datetime) WHERE state != 'cancelled';
              </code>
              <div className="pt-2 border-t border-slate-800 text-[10px] space-y-1">
                <div className="flex gap-2">
                  <span className="text-slate-500 font-bold">Tipe Index:</span>
                  <span>B-Tree (Composite)</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-500 font-bold">Kondisi:</span>
                  <span>Partial Index (`WHERE state != 'cancelled'`)</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-500 font-bold">Manfaat:</span>
                  <span>Menolak pembacaan row yang dibatalkan demi efisiensi space index disk global.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-indigo-950/20 border border-indigo-900/40 rounded-xl text-xs text-indigo-300 leading-relaxed mt-4 flex items-start gap-2.5">
            <HelpCircle className="w-5 h-5 shrink-0 text-indigo-400" />
            <div>
              <p className="font-semibold">Odoo 17 Overlap Logic</p>
              <p className="text-slate-400 mt-1">
                Logika overlap: <code className="text-indigo-400">start_datetime &lt; record.end_datetime</code> DAN <code className="text-indigo-400">end_datetime &gt; record.start_datetime</code>. 
                Secara matematis, irisan waktu pasti dan mutlak terdeteksi jika kedua kondisi relasional tersebut terpenuhi bersama-sama.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
