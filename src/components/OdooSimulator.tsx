/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Asset, Booking, OrmLog } from '../types';
import { 
  Calendar as CalendarIcon, 
  List, 
  FileText, 
  Plus, 
  Trash2, 
  Settings, 
  Search, 
  Check, 
  X, 
  RotateCcw, 
  CalendarDays, 
  User, 
  Phone, 
  Clock, 
  FileEdit, 
  ChevronLeft, 
  ChevronRight, 
  Database,
  Terminal,
  Info,
  Car,
  Building2,
  Eye
} from 'lucide-react';

const INITIAL_ASSETS: Asset[] = [
  { id: 1, name: 'Ruangan 1', code: 'AST/ROOM-01', category: 'room', description: 'Kapasitas 10 orang, dilengkapi smart TV, AC, dan glass whiteboard.', active: true },
  { id: 2, name: 'Ruangan 2', code: 'AST/ROOM-02', category: 'room', description: 'Kapasitas 15 orang, dilengkapi Proyektor HD, AC, dan audio system.', active: true },
  { id: 3, name: 'Ruangan 3', code: 'AST/ROOM-03', category: 'room', description: 'Kapasitas 6 orang, sangat cocok untuk meeting internal harian.', active: true },
  { id: 4, name: 'Ruangan 4', code: 'AST/ROOM-04', category: 'room', description: 'Kapasitas 25 orang, dilengkapi fasilitas webinar hybrid audio visual.', active: true },
  { id: 5, name: 'Mobil 1', code: 'AST/VEH-01', category: 'vehicle', description: 'Toyota Avanza Veloz putih, transmisi matic, bensin penuh, e-toll siap pakai.', active: true },
  { id: 6, name: 'Mobil 2', code: 'AST/VEH-02', category: 'vehicle', description: 'Toyota Innova Reborn hitam, transmisi matic, sedia untuk direksi & operasional dinas.', active: true },
  { id: 7, name: 'Mobil 3', code: 'AST/VEH-03', category: 'vehicle', description: 'HiAce Commuter putih, kapasitas 15 orang, bensin penuh untuk rombongan luar kota.', active: true },
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 1,
    asset_id: 1,
    asset_name: 'Ruangan 1',
    borrower_name: 'Budi Santoso',
    whatsapp_number: '6281234567890',
    start_datetime: '2026-06-05T09:00',
    end_datetime: '2026-06-05T12:00',
    purpose: 'Rapat koordinasi strategi penjualan Q2 dengan Tim Sales Regional Jawa Barat.',
    state: 'confirmed'
  },
  {
    id: 2,
    asset_id: 5,
    asset_name: 'Mobil 1',
    borrower_name: 'Siti Rahma',
    whatsapp_number: '6285711223344',
    start_datetime: '2026-06-05T13:00',
    end_datetime: '2026-06-05T17:30',
    purpose: 'Kunjungan lapangan dan survei lokasi distribusi gudang di daerah Cikarang.',
    state: 'confirmed'
  },
  {
    id: 3,
    asset_id: 1,
    asset_name: 'Ruangan 1',
    borrower_name: 'Ahmad Faisal',
    whatsapp_number: '628998877665',
    start_datetime: '2026-06-06T10:00',
    end_datetime: '2026-06-06T12:30',
    purpose: 'Review sprint mingguan bersama Senior Software Developers & UI/UX.',
    state: 'draft'
  },
  {
    id: 4,
    asset_id: 2,
    asset_name: 'Ruangan 2',
    borrower_name: 'Jessica Iskandar',
    whatsapp_number: '6281122334455',
    start_datetime: '2026-06-05T08:00',
    end_datetime: '2026-06-05T16:00',
    purpose: 'Demo produk ke client eksternal di Ballroom.',
    state: 'confirmed'
  }
];

interface OdooSimulatorProps {
  onLogTriggered: (log: OrmLog) => void;
}

export default function OdooSimulator({ onLogTriggered }: OdooSimulatorProps) {
  // Active states
  const [currentMenu, setCurrentMenu] = useState<'bookings' | 'assets'>('bookings');
  const [currentView, setCurrentView] = useState<'calendar' | 'tree' | 'form'>('calendar');
  
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [searchQuery, setSearchQuery] = useState('');

  // Statistics States
  const [selectedStatsDate, setSelectedStatsDate] = useState('2026-06-05');
  const [showAvailableVehicles, setShowAvailableVehicles] = useState(false);

  // Room statistical computations
  const roomStats = useMemo(() => {
    const rooms = assets.filter(a => a.category === 'room');
    
    // Find active confirmed or draft bookings on selected date
    const bookedIis = bookings
      .filter(b => b.start_datetime.startsWith(selectedStatsDate) && b.state !== 'cancelled')
      .map(b => b.asset_id);
    
    const uniqueBookedIds = Array.from(new Set(bookedIis));
    const terpakaiRooms = rooms.filter(r => uniqueBookedIds.includes(r.id));
    const tidakTerpakaiRooms = rooms.filter(r => !uniqueBookedIds.includes(r.id));
    
    return {
      total: rooms.length,
      terpakaiCount: terpakaiRooms.length,
      tidakTerpakaiCount: tidakTerpakaiRooms.length,
      terpakaiList: terpakaiRooms,
      tidakTerpakaiList: tidakTerpakaiRooms
    };
  }, [assets, bookings, selectedStatsDate]);

  // Vehicle statistical computations
  const vehicleStats = useMemo(() => {
    const vehicles = assets.filter(a => a.category === 'vehicle');
    
    // Find active confirmed or draft bookings on selected date
    const bookedIis = bookings
      .filter(b => b.start_datetime.startsWith(selectedStatsDate) && b.state !== 'cancelled')
      .map(b => b.asset_id);
    
    const uniqueBookedIds = Array.from(new Set(bookedIis));
    const terpakaiVehicles = vehicles.filter(v => uniqueBookedIds.includes(v.id));
    const tidakTerpakaiVehicles = vehicles.filter(v => !uniqueBookedIds.includes(v.id));
    
    return {
      total: vehicles.length,
      terpakaiCount: terpakaiVehicles.length,
      tidakTerpakaiCount: tidakTerpakaiVehicles.length,
      terpakaiList: terpakaiVehicles,
      tidakTerpakaiList: tidakTerpakaiVehicles
    };
  }, [assets, bookings, selectedStatsDate]);
  
  // Form Edit/Create parameters
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [activeAssetId, setActiveAssetId] = useState<number | null>(null);
  
  // Temporary form state
  const [formState, setFormState] = useState<Partial<Booking>>({
    asset_id: 1,
    borrower_name: '',
    whatsapp_number: '',
    start_datetime: '',
    end_datetime: '',
    purpose: '',
    state: 'draft'
  });

  const [formError, setFormError] = useState<string | null>(null);

  // Calendar parameters
  const [calendarDate, setCalendarDate] = useState<Date>(new Date('2026-06-05'));

  const generateOrmLog = (type: 'info' | 'warning' | 'error' | 'success', message: string, details?: string) => {
    const log: OrmLog = {
      id: Math.random().toString(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      details
    };
    onLogTriggered(log);
  };

  // Switch to Form for writing new booking
  const handleOpenCreateForm = (initials?: Partial<Booking>) => {
    setFormError(null);
    setSelectedBookingId(null);
    const activeAssets = assets.filter(a => a.active);
    const fallbackAssetId = activeAssets.length > 0 ? activeAssets[0].id : 1;
    
    setFormState({
      id: undefined,
      asset_id: initials?.asset_id || fallbackAssetId,
      borrower_name: initials?.borrower_name || '',
      whatsapp_number: initials?.whatsapp_number || '',
      start_datetime: initials?.start_datetime || '2026-06-05T09:00',
      end_datetime: initials?.end_datetime || '2026-06-05T10:00',
      purpose: initials?.purpose || '',
      state: 'draft'
    });
    setCurrentView('form');
    generateOrmLog('info', `GUI call: Loaded blank form for transient record asset.booking.`);
  };

  const handleOpenEditForm = (booking: Booking) => {
    setFormError(null);
    setSelectedBookingId(booking.id);
    setFormState({ ...booking });
    setCurrentView('form');
    generateOrmLog('info', `GUI call: Fetched data for persistent record asset.booking(id=${booking.id}).`);
  };

  // Overlapping Validation Simulator (Runs the exact Odoo Python logic)
  const validateAndSave = () => {
    setFormError(null);
    
    // Simple basic checks
    if (!formState.borrower_name || !formState.whatsapp_number || !formState.start_datetime || !formState.end_datetime || !formState.purpose) {
      setFormError("Mohon lengkapi semua kolom wajib bertanda merah (*).");
      generateOrmLog('warning', "Odoo Field Validation failed: Missing required fields!");
      return;
    }

    if (!formState.asset_id) {
      setFormError("Silakan pilih aset terlebih dahulu.");
      return;
    }

    const startStr = formState.start_datetime;
    const endStr = formState.end_datetime;
    const startNum = new Date(startStr).getTime();
    const endNum = new Date(endStr).getTime();

    if (startNum >= endNum) {
      const errMsg = "Waktu Mulai harus lebih awal daripada Waktu Selesai!";
      setFormError(errMsg);
      generateOrmLog('error', `Odoo ORM Validation Failed: ValidationError("${errMsg}")`);
      return;
    }

    // SIMULATED ODOO ORM SEARCH_COUNT PROCESS WITH LOGS
    const selectedAsset = assets.find(a => a.id === Number(formState.asset_id));
    const assetName = selectedAsset ? selectedAsset.name : 'Unknown';

    generateOrmLog('info', `Python context: Executing @api.constrains('_check_overlapping_bookings') for asset.booking.`);
    
    // Print exact postgres/ORM query representation
    const queryDomain = `[
    ('asset_id', '=', ${formState.asset_id}), 
    ('id', '!=', ${selectedBookingId || 'unseated'}), 
    ('start_datetime', '<', '${endStr}'), 
    ('end_datetime', '>', '${startStr}'),
    ('state', '!=', 'cancelled')
]`;
    
    generateOrmLog('info', `SQL Plan: Executing search_count on asset.booking.`, `domain: ${queryDomain}`);

    // Count overlaps manually in simulated database array
    const overlaps = bookings.filter(b => {
      // Must be same asset
      if (b.asset_id !== Number(formState.asset_id)) return false;
      // Exclude self (for editing)
      if (selectedBookingId !== null && b.id === selectedBookingId) return false;
      // Skip cancelled bookings
      if (b.state === 'cancelled') return false;

      // Overlap logic: B.start < A.end AND B.end > A.start
      const bStart = new Date(b.start_datetime).getTime();
      const bEnd = new Date(b.end_datetime).getTime();

      return bStart < endNum && bEnd > startNum;
    });

    if (overlaps.length > 0) {
      // Conflict detected!
      const overlapItem = overlaps[0];
      const conflictMsg = `Konflik Jadwal detect! Aset '${assetName}' sudah dibooking oleh '${overlapItem.borrower_name}' pada rentang waktu [${overlapItem.start_datetime.replace('T', ' ')} s.d ${overlapItem.end_datetime.replace('T', ' ')}]. Silakan pilih jadwal atau aset lain.`;
      
      setFormError(conflictMsg);
      generateOrmLog('error', `Odoo ORM Validation Raised ValidationError!`, conflictMsg);
      return;
    }

    // Passed validation! Proceeding to persist in simulated state
    generateOrmLog('success', `ORM write: Successfully executed search_count. Overlaps=0. Saved record!`);

    if (selectedBookingId !== null) {
      // Editing Mode
      setBookings(prev => prev.map(b => b.id === selectedBookingId ? {
        ...(formState as Booking),
        id: selectedBookingId,
        asset_name: assetName,
        asset_id: Number(formState.asset_id)
      } : b));
      generateOrmLog('success', `DB Transaction: COMMIT UPDATE asset_booking WHERE id = ${selectedBookingId}`);
    } else {
      // New Booking Creation Mode
      const newId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
      const newRecord: Booking = {
        id: newId,
        asset_id: Number(formState.asset_id),
        asset_name: assetName,
        borrower_name: formState.borrower_name || '',
        whatsapp_number: formState.whatsapp_number || '',
        start_datetime: startStr,
        end_datetime: endStr,
        purpose: formState.purpose || '',
        state: formState.state as 'draft' | 'confirmed' | 'cancelled' || 'draft'
      };
      setBookings(prev => [...prev, newRecord]);
      generateOrmLog('success', `DB Transaction: COMMIT INSERT INTO asset_booking VALUES (${newId}, '${assetName}')`);
    }

    setCurrentView('calendar');
  };

  const handleStateChangeOnForm = (nextState: 'draft' | 'confirmed' | 'cancelled') => {
    setFormState(prev => ({ ...prev, state: nextState }));
    generateOrmLog('info', `State transition request for asset.booking state='${nextState}'`);
  };

  // Quick State change directly from view list
  const updateBookingStateDirectly = (id: number, nextState: 'draft' | 'confirmed' | 'cancelled') => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, state: nextState } : b));
    generateOrmLog('success', `Quick update state to ${nextState} for asset.booking(id=${id}) done.`);
  };

  const deleteBookingRecord = (id: number) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    generateOrmLog('warning', `DB Transaction: UNLINK FROM asset_booking WHERE id = ${id}`);
    if (selectedBookingId === id) {
      setCurrentView('calendar');
    }
  };

  // Calendar month rendering
  const calendarYear = calendarDate.getFullYear();
  const calendarMonth = calendarDate.getMonth();

  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarYear, calendarMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarYear, calendarMonth + 1, 1));
  };

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Dynamic calendar grid math representation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay(); // Sunday is 0
    const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const prevMonthTotalDays = new Date(calendarYear, calendarMonth, 0).getDate();

    const daysList = [];

    // Prior Month placeholders
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      daysList.push({
        day: prevMonthTotalDays - i,
        monthOffset: -1,
        dateString: `${calendarYear}-${String(calendarMonth).padStart(2, '0')}-${String(prevMonthTotalDays - i).padStart(2, '0')}`
      });
    }

    // Current Month days
    for (let i = 1; i <= totalDays; i++) {
      daysList.push({
        day: i,
        monthOffset: 0,
        dateString: `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }

    // Next Month placeholders to fill full grid layout
    const gridRemaining = 42 - daysList.length;
    for (let i = 1; i <= gridRemaining; i++) {
      daysList.push({
        day: i,
        monthOffset: 1,
        dateString: `${calendarYear}-${String(calendarMonth + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }

    return daysList;
  }, [calendarYear, calendarMonth]);

  // Find bookings belonging to a specific date string (YYYY-MM-DD)
  const getBookingsForDate = (dateStr: string) => {
    return bookings.filter(b => {
      const bDate = b.start_datetime.substring(0, 10);
      return bDate === dateStr;
    });
  };

  // Search filter
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const term = searchQuery.toLowerCase();
      return (
        b.borrower_name.toLowerCase().includes(term) ||
        b.asset_name.toLowerCase().includes(term) ||
        b.purpose.toLowerCase().includes(term) ||
        b.whatsapp_number.includes(term)
      );
    });
  }, [bookings, searchQuery]);

  // Dynamic calculation for Asset statistics info
  const assetStatusMap = useMemo(() => {
    // Collect status tags
    const activeMapping: Record<number, boolean> = {};
    assets.forEach(a => {
      activeMapping[a.id] = a.active;
    });
    return activeMapping;
  }, [assets]);

  return (
    <div id="odoo-client-wrapper" className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-xs flex flex-col text-zinc-850">
      
      {/* Top Banner Odoo Titlebar - Clean Minimalism refinement */}
      <header id="odoo-titlebar" className="bg-[#714B67] text-white px-5 py-3.5 flex items-center justify-between select-none border-b border-zinc-900/10">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-2 py-1 rounded-md flex items-center justify-center border border-white/10">
            <span className="font-extrabold text-xs tracking-wider text-pink-100">O17</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight">Odoo Enterprise</span>
            <span className="text-[10px] text-pink-200 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md font-mono">native-orm</span>
          </div>
        </div>

        {/* Status System Credit indicators */}
        <div className="flex items-center gap-3 text-zinc-100">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] text-pink-100/80 font-mono tracking-tight">RPC Server Active</span>
        </div>
      </header>

      {/* Main App Navigation Workspace */}
      <div id="odoo-workspace" className="flex flex-1 flex-col lg:flex-row">
        {/* Left Hand Odoo Sidebar Navigation Panel in Clean Minimalist Off-White style */}
        <aside id="odoo-sidebar" className="w-full lg:w-60 bg-zinc-50 text-zinc-700 flex flex-col p-4 border-r border-zinc-200 select-none">
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest px-2.5 mb-3.5">Addon Reservasi</div>
          
          <nav className="space-y-1.5">
            <button
              id="menu-booking-btn"
              onClick={() => {
                setCurrentMenu('bookings');
                setCurrentView('calendar');
                generateOrmLog('info', `Menu switch: Navigated to asset.booking screen.`);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                currentMenu === 'bookings' 
                  ? 'bg-zinc-900 text-white font-semibold shadow-xs' 
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <CalendarIcon className={`w-4 h-4 ${currentMenu === 'bookings' ? 'text-white' : 'text-zinc-400'}`} />
                Booking &amp; Peminjaman
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${currentMenu === 'bookings' ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200/80 text-zinc-500'}`}>{bookings.length}</span>
            </button>

            <button
              id="menu-asset-btn"
              onClick={() => {
                setCurrentMenu('assets');
                setCurrentView('tree'); // Assets has no calendar, defaults to list
                generateOrmLog('info', `Menu switch: Opened asset.master catalog database.`);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                currentMenu === 'assets' 
                  ? 'bg-zinc-900 text-white font-semibold shadow-xs' 
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Settings className={`w-4 h-4 ${currentMenu === 'assets' ? 'text-white' : 'text-zinc-400'}`} />
                Inventaris Aset (Master)
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${currentMenu === 'assets' ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200/80 text-zinc-500'}`}>{assets.length}</span>
            </button>
          </nav>

          {/* Quick Stats Widget */}
          <div className="mt-8 lg:mt-auto pt-4 border-t border-zinc-250/60 text-xs text-zinc-500">
            <div className="font-bold text-zinc-400 uppercase tracking-widest text-[9px] mb-2.5 px-2">Live Registry Statistics</div>
            <div className="bg-white p-3 rounded-xl border border-zinc-200 space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-450">Total Aset:</span>
                <span className="font-bold text-zinc-800 font-mono">{assets.length}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-450">Aset Aktif / Siap:</span>
                <span className="font-bold text-emerald-600 font-mono">{assets.filter(a => a.active).length}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-450">Peminjaman Disetujui:</span>
                <span className="font-bold text-[#714B67] font-mono">{bookings.filter(b => b.state === 'confirmed').length}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Center UI Panel Screen */}
        <main id="odoo-interface" className="flex-1 p-5 md:p-6 lg:p-7 flex flex-col bg-white overflow-x-hidden">
          
          {/* Top Control Bar Area (Breadcrumbs, Buttons, Search and View Switchers) */}
          <div id="odoo-control-panel" className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-150 mb-6">
            
            {/* Left: Breadcrumbs + Actions */}
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5 select-none">
                <span>Asset Booking</span>
                <span>/</span>
                <span className="text-zinc-600 font-semibold">{currentMenu === 'bookings' ? 'Transaksi' : 'Konfigurasi'}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold tracking-tight text-zinc-900 font-display">
                  {currentMenu === 'bookings' ? 'Daftar Booking Aset' : 'Master Data Inventaris'}
                </h1>
                
                {currentView !== 'form' && currentMenu === 'bookings' && (
                  <button
                    id="panel-btn-create-booking"
                    onClick={() => handleOpenCreateForm()}
                    className="bg-[var(--color-odoo-teal)] hover:bg-[var(--color-odoo-teal-hover)] text-white font-semibold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Create Booking
                  </button>
                )}
              </div>
            </div>

            {/* Right: Search Box + View Mode Toggle Icon Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Native Search filter input */}
              {currentView !== 'form' && (
                <div className="relative w-48 md:w-56">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                    <Search className="w-3.5 h-3.5" />
                  </span>
                  <input
                    id="odoo-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search borrower or asset..."
                    className="w-full text-xs pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-zinc-500 text-zinc-800 placeholder-zinc-400"
                  />
                </div>
              )}

              {/* View Switches (Calendar vs Tree/List vs Form) */}
              {currentMenu === 'bookings' && (
                <div id="odoo-view-switchers" className="bg-zinc-100 p-1 rounded-xl border border-zinc-200/80 flex gap-1">
                  <button
                    id="view-btn-calendar"
                    onClick={() => {
                      setCurrentView('calendar');
                      generateOrmLog('info', `View switch: Switched to primary calendar layout.`);
                    }}
                    title="Calendar View"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      currentView === 'calendar' 
                        ? 'bg-white text-zinc-900 shadow-3xs' 
                        : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                  >
                    <CalendarIcon className="w-4 h-4" />
                  </button>
                  <button
                    id="view-btn-tree"
                    onClick={() => {
                      setCurrentView('tree');
                      generateOrmLog('info', `View switch: Restored list grid representation.`);
                    }}
                    title="Tree/List View"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      currentView === 'tree' 
                        ? 'bg-white text-zinc-900 shadow-3xs' 
                        : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* INTERACTIVE CALCULATION DASHBOARD */}
          {currentMenu === 'bookings' && currentView !== 'form' && (
            <div id="assets-analytics-dashboard" className="mb-6 bg-gradient-to-br from-zinc-50 to-zinc-100/50 p-5 rounded-2xl border border-zinc-200 shadow-3xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/85">
                <div>
                  <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#714B67]" />
                    Real-time Kalkulasi Keterpakaian Aset
                  </h2>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Menghitung sirkulasi ketersediaan ruangan rapat dan kendaraan berdasarkan tanggal di bawah ini.
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-wide">Tanggal Kalkulasi:</span>
                  <input
                    type="date"
                    value={selectedStatsDate}
                    onChange={(e) => {
                      setSelectedStatsDate(e.target.value);
                      generateOrmLog('info', `Recalculating statistics: Changed date filter to ${e.target.value}.`);
                    }}
                    className="bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-xs text-zinc-800 font-bold outline-none focus:border-[#714B67]"
                  />
                </div>
              </div>

              {/* Grid of Calculations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 🏢 Rooms Card */}
                <div className="bg-white p-4 rounded-xl border border-zinc-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-sky-600" />
                        Aset Ruangan (Total: {roomStats.total})
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">Category: room</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-rose-50/50 border border-rose-100 p-2.5 rounded-lg text-center">
                        <span className="text-[10px] block font-semibold text-rose-600 mb-0.5">TERPAKAI</span>
                        <span className="text-lg font-extrabold text-rose-700 font-mono">{roomStats.terpakaiCount}</span>
                        <span className="text-[9px] text-rose-500 block mt-0.5">Ruang Rapat</span>
                      </div>
                      <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-lg text-center">
                        <span className="text-[10px] block font-semibold text-emerald-600 mb-0.5">TIDAK TERPAKAI (TERSEDIA)</span>
                        <span className="text-lg font-extrabold text-emerald-700 font-mono">{roomStats.tidakTerpakaiCount}</span>
                        <span className="text-[9px] text-emerald-500 block mt-0.5">Siap Digunakan</span>
                      </div>
                    </div>
                  </div>

                  {/* List of Rooms */}
                  <div className="text-[11px] border-t border-zinc-100 pt-3 space-y-1">
                    <span className="text-[9px] font-extrabold text-zinc-450 uppercase tracking-widest font-mono block mb-1">Status Asset Ruangan ({selectedStatsDate}):</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {assets.filter(a => a.category === 'room').map(r => {
                        const isTerpakai = roomStats.terpakaiList.some(tr => tr.id === r.id);
                        return (
                          <div key={r.id} className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${isTerpakai ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                            <span className="text-zinc-700 font-medium truncate" title={r.name}>{r.name}</span>
                            <span className={`text-[8px] px-1 rounded ${isTerpakai ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                              {isTerpakai ? 'Terpakai' : 'Bebas'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 🚗 Vehicles Card */}
                <div className="bg-white p-4 rounded-xl border border-zinc-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                        <Car className="w-4 h-4 text-emerald-600" />
                        Aset Kendaraan (Total: {vehicleStats.total})
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">Category: vehicle</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-rose-50/50 border border-rose-100 p-2.5 rounded-lg text-center">
                        <span className="text-[10px] block font-semibold text-rose-600 mb-0.5">TERPAKAI</span>
                        <span className="text-lg font-extrabold text-rose-700 font-mono">{vehicleStats.terpakaiCount}</span>
                        <span className="text-[9px] text-rose-550 block mt-0.5">Sedang Digunakan</span>
                      </div>
                      
                      {/* Clickable stat card for available vehicles */}
                      <button
                        onClick={() => {
                          setShowAvailableVehicles(!showAvailableVehicles);
                          generateOrmLog('info', `User interaction: Toggled list of available vehicle types to state: ${!showAvailableVehicles}`);
                        }}
                        className="bg-emerald-50 hover:bg-emerald-100/75 border border-emerald-200 p-2.5 rounded-lg text-center cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 flex flex-col justify-center items-center"
                        title="Klik untuk melihat jenis semua kendaraan yang tersedia"
                      >
                        <span className="text-[10px] block font-bold text-emerald-700 mb-0.5 uppercase tracking-tight flex items-center gap-1 justify-center">
                          KENDARAAN TERSEDIA <Eye className="w-3.5 h-3.5 inline text-emerald-600" />
                        </span>
                        <span className="text-lg font-extrabold text-emerald-800 font-mono flex items-center gap-1.5">
                          {vehicleStats.tidakTerpakaiCount} <span className="text-xs font-semibold text-emerald-600">Mobil</span>
                        </span>
                        <span className="text-[8px] bg-emerald-650 text-white rounded px-1.5 mt-0.5 uppercase font-extrabold tracking-widest leading-relaxed">Klik Detail</span>
                      </button>
                    </div>
                  </div>

                  {/* Status checklist of Vehicles list */}
                  <div className="text-[11px] border-t border-zinc-100 pt-3 space-y-1">
                    <span className="text-[9px] font-extrabold text-zinc-450 uppercase tracking-widest font-mono block mb-1">Status Kendaraan Operasional ({selectedStatsDate}):</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {assets.filter(a => a.category === 'vehicle').map(v => {
                        const isTerpakai = vehicleStats.terpakaiList.some(tv => tv.id === v.id);
                        return (
                          <div key={v.id} className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${isTerpakai ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                            <span className="text-zinc-700 font-medium truncate" title={v.name}>{v.name}</span>
                            <span className={`text-[8px] px-1 rounded ${isTerpakai ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                              {isTerpakai ? 'Terpakai' : 'Bebas'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* EXPANDED SECTION: "Pilihan Jenis Kendaraan Tersedia" */}
              {showAvailableVehicles && (
                <div id="available-vehicles-expanded" className="bg-emerald-50/45 border border-emerald-250 p-4 rounded-xl text-xs space-y-3 shadow-2xs transition-all duration-300">
                  <div className="flex justify-between items-center pb-2 border-b border-rose-200/20">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5 uppercase tracking-wide">
                      <Car className="w-4 h-4 text-emerald-600" />
                      Daftar Katalog Kendaraan Tersedia untuk Tanggal {selectedStatsDate}
                    </span>
                    <button
                      onClick={() => setShowAvailableVehicles(false)}
                      className="text-zinc-400 hover:text-zinc-650 p-1 hover:bg-emerald-100 rounded-lg cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {vehicleStats.tidakTerpakaiCount === 0 ? (
                    <div className="py-2 text-center text-zinc-500 italic font-medium bg-white rounded-lg border border-zinc-150 p-3">
                      ⚠️ Maaf, tidak ada kendaraan operasional yang bebas untuk tanggal terpilih. Semua sedang dibooking.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {vehicleStats.tidakTerpakaiList.map(v => (
                        <div key={v.id} className="bg-white p-3.5 rounded-lg border border-emerald-150 flex flex-col justify-between hover:border-emerald-350 transition-all shadow-3xs">
                          <div>
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">{v.code}</span>
                              <span className="bg-emerald-600 text-white font-extrabold text-[8px] px-2 py-0.5 rounded-full uppercase tracking-widest leading-none">Ready</span>
                            </div>
                            <span className="font-bold text-zinc-900 text-xs block mb-1">{v.name}</span>
                            <span className="text-[10px] text-zinc-500 leading-relaxed block mb-2">{v.description}</span>
                          </div>

                          <div className="mt-2 pt-2 border-t border-zinc-100">
                            <button
                              onClick={() => {
                                handleOpenCreateForm({
                                  asset_id: v.id,
                                  start_datetime: `${selectedStatsDate}T09:00`,
                                  end_datetime: `${selectedStatsDate}T12:00`
                                });
                                generateOrmLog('info', `Quick flow: Loaded booking creation for available vehicle '${v.name}'.`);
                              }}
                              className="w-full bg-[#714B67] hover:bg-[#5b3c53] text-white font-bold py-1.5 rounded-lg text-[10px] transition-colors uppercase tracking-wider cursor-pointer"
                            >
                              Pesan Mobil Ini
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* VIEW: ASSETS MASTER GRID */}
          {currentMenu === 'assets' && (
            <div id="asset-catalog-view" className="space-y-5">
              <div className="bg-amber-50/40 border border-amber-250/50 text-amber-905 rounded-xl p-4 flex gap-3 text-xs leading-relaxed max-w-3xl shadow-3xs">
                <Info className="w-4.5 h-4.5 shrink-0 text-amber-500" />
                <div>
                  <p className="font-bold text-zinc-900">Konfigurasi Katalog Asset (asset.master)</p>
                  <span className="text-zinc-500 mt-0.5 block">
                    Aset yang non-aktif (Aktif: False) secara otomatis difilter keluar dari relational form booking melalui domain Odoo 
                    <code className="bg-amber-100/60 text-[#714B67] px-1 py-0.5 rounded font-mono ml-1 text-[11px] border border-amber-200/40">"[('active', '=', True)]"</code>.
                  </span>
                </div>
              </div>

              {/* Grid of raw assets in clean minimal layout */}
              <div id="asset-inventory-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assets.map(asset => (
                  <div key={asset.id} id={`asset-card-${asset.id}`} className="border border-zinc-200/80 rounded-2xl p-5 bg-white flex flex-col justify-between hover:border-zinc-400/80 transition-all shadow-3xs">
                    <div>
                      <div className="flex justify-between items-center gap-2 mb-3">
                        <span className="text-[9px] font-mono tracking-wider bg-zinc-100 border border-zinc-200/60 px-2 py-0.5 rounded-md text-zinc-500 font-bold">{asset.code}</span>
                        <button
                          onClick={() => {
                            setAssets(prev => prev.map(a => a.id === asset.id ? { ...a, active: !a.active } : a));
                            generateOrmLog('success', `Quick edit: Toggled active status of asset.master(id=${asset.id}) to ${!asset.active}`);
                          }}
                          className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full transition-all border cursor-pointer ${
                            asset.active 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-250 bg-opacity-65' 
                              : 'bg-rose-50 text-rose-700 border-rose-250 bg-opacity-65'
                          }`}
                        >
                          {asset.active ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                      <h3 className="font-bold text-zinc-900 text-sm mb-1.5">{asset.name}</h3>
                      <span className="text-[9px] font-bold text-zinc-500 capitalize bg-zinc-100 border border-zinc-200/60 px-2 py-0.5 rounded-md">
                        Kategori: {asset.category === 'room' ? 'Ruang Rapat' : asset.category === 'vehicle' ? 'Operasional Mobil' : 'Elektronik'}
                      </span>
                      <p className="text-xs text-zinc-500 mt-3 line-clamp-2 leading-relaxed">{asset.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: CALENDAR VIEW (PRIMARY VIEW MODE FOR BOOKINGS) */}
          {currentMenu === 'bookings' && currentView === 'calendar' && (
            <div id="calendar-view-panel" className="flex flex-col flex-1">
              {/* Calendar Grid Controller Bar in Clean Minimalism */}
              <div className="flex items-center justify-between mb-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4.5 h-4.5 text-[#714B67]" />
                  <span className="font-bold text-xs md:text-sm text-zinc-900 font-display">
                    Jadwal Bulanan: {monthNames[calendarMonth]} {calendarYear}
                  </span>
                </div>
                
                <div className="flex gap-1 bg-white p-1 border border-zinc-200 rounded-xl shadow-3xs">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 text-zinc-500" />
                  </button>
                  <button
                    onClick={() => setCalendarDate(new Date('2026-06-05'))}
                    className="text-[10px] uppercase font-bold tracking-wider px-2 hover:bg-zinc-100 rounded-md text-zinc-600 transition-colors cursor-pointer"
                  >
                    Hari Ini (Juni 5)
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>
                </div>
              </div>

              {/* Quick Instruction Banner - Clean minimalism refinement */}
              <div className="mb-4 bg-zinc-100/60 text-[10px] font-mono uppercase tracking-wider text-zinc-600 p-3 rounded-xl border border-zinc-200 flex items-center justify-between">
                <span>⚡ Odoo Flow: <strong>Klik tanggal</strong> untuk memicu form booking otomatis!</span>
                <span className="text-[10px] font-extrabold text-[#714B67] select-none">Quick Booking</span>
              </div>

              {/* Standard Calendar Grid Layout */}
              <div id="calendar-days-grid" className="grid grid-cols-7 gap-1 flex-1 min-h-[450px]">
                {/* Header Labels */}
                {['Ming', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((daylabel, index) => (
                  <div key={daylabel} className={`text-center py-2 text-[10px] uppercase font-bold tracking-wider rounded font-mono ${index === 0 || index === 6 ? 'text-amber-600' : 'text-zinc-400'}`}>
                    {daylabel}
                  </div>
                ))}

                {/* Date Day Blocks */}
                {calendarDays.map((dayObj, i) => {
                  const dayBookings = getBookingsForDate(dayObj.dateString);
                  const isToday = dayObj.dateString === '2026-06-05';

                  return (
                    <div
                      key={`${dayObj.dateString}-${i}`}
                      id={`calendar-cell-${dayObj.dateString}`}
                      onClick={() => handleOpenCreateForm({
                        start_datetime: `${dayObj.dateString}T09:00`,
                        end_datetime: `${dayObj.dateString}T11:00`,
                        borrower_name: '',
                        purpose: ''
                      })}
                      className={`min-h-[100px] p-2 border border-zinc-200/60 rounded-xl flex flex-col justify-between transition-all cursor-pointer group hover:bg-zinc-50 ${
                        dayObj.monthOffset !== 0 
                          ? 'bg-zinc-50/20 opacity-30' 
                          : 'bg-white'
                      } ${isToday ? 'ring-2 ring-zinc-900 ring-offset-2' : ''}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                          isToday ? 'bg-zinc-950 text-white' : 'text-zinc-550'
                        }`}>
                          {dayObj.day}
                        </span>
                        
                        <span className="text-[9px] text-[#00A09D] group-hover:opacity-100 opacity-0 transition-opacity font-bold uppercase tracking-wider font-mono">
                          + Add
                        </span>
                      </div>

                      {/* Display small indicator pills for each booking occurring on this date */}
                      <div className="space-y-1 flex-1 overflow-y-auto max-h-[65px] scrollbar-thin">
                        {dayBookings.map(b => (
                          <div
                            key={b.id}
                            id={`cal-event-${b.id}`}
                            onClick={(e) => {
                              e.stopPropagation(); // Avoid triggering parent Click creation
                              handleOpenEditForm(b);
                            }}
                            className={`px-2 py-1 rounded-md text-[9px] font-semibold leading-tight truncate border transition-all ${
                              b.state === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : b.state === 'cancelled'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                            title={`Borrower: ${b.borrower_name}\nAsset: ${b.asset_name}`}
                          >
                            <span className="font-bold mr-0.5 font-mono">{b.start_datetime.substring(11, 16)}</span>
                            {b.borrower_name} : {b.asset_name.split(' ')[0]}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW: TREE/LIST VIEW */}
          {currentMenu === 'bookings' && currentView === 'tree' && (
            <div id="tree-view-panel" className="border border-zinc-250 rounded-2xl overflow-hidden bg-white shadow-3xs">
              <div className="overflow-x-auto">
                <table id="bookings-tree-table" className="w-full text-left text-xs border-collapse">
                  <thead className="bg-zinc-50 text-zinc-500 font-bold uppercase tracking-wider select-none border-b border-zinc-250 text-[10px]">
                    <tr>
                      <th className="px-5 py-3.5">Nama Peminjam</th>
                      <th className="px-5 py-3.5">Aset</th>
                      <th className="px-5 py-3.5">Nomor WhatsApp</th>
                      <th className="px-5 py-3.5">Mulai</th>
                      <th className="px-5 py-3.5">Selesai</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-150">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center text-zinc-400 font-medium">
                          Tidak ada transaksi booking terdaftar untuk pencarian Anda.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map(b => (
                        <tr 
                          key={b.id} 
                          id={`tree-row-${b.id}`}
                          onClick={() => handleOpenEditForm(b)}
                          className="hover:bg-zinc-50/70 cursor-pointer group transition-colors text-zinc-700"
                        >
                          <td className="px-5 py-4 font-bold text-zinc-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#714B67]" />
                            {b.borrower_name}
                          </td>
                          <td className="px-5 py-4 text-zinc-650">
                            {b.asset_name}
                          </td>
                          <td className="px-5 py-4 font-mono text-zinc-500 font-medium select-all">
                            {b.whatsapp_number}
                          </td>
                          <td className="px-5 py-4 text-zinc-500 font-mono text-[11px]">
                            {b.start_datetime.replace('T', ' ')}
                          </td>
                          <td className="px-5 py-4 text-zinc-500 font-mono text-[11px]">
                            {b.end_datetime.replace('T', ' ')}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase inline-block border ${
                              b.state === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : b.state === 'cancelled'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                              {b.state === 'confirmed' ? 'Disetujui' : b.state === 'cancelled' ? 'Dibatalkan' : 'Pengajuan'}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {b.state === 'draft' && (
                                <button
                                  id={`btn-approve-${b.id}`}
                                  onClick={() => updateBookingStateDirectly(b.id, 'confirmed')}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                                  title="Setujui"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                id={`btn-delete-${b.id}`}
                                onClick={() => deleteBookingRecord(b.id)}
                                className="p-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                title="Unlink Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}          {/* VIEW: ODOO FORM VIEW SYSTEM */}
          {currentView === 'form' && (
            <div id="odoo-form-panel" className="bg-white border border-zinc-200 rounded-2xl flex flex-col shadow-3xs">
              
              {/* Odoo Form Header statusbar and buttons */}
              <div id="form-statusbar" className="bg-zinc-50 px-5 py-4 rounded-t-2xl border-b border-zinc-200 flex flex-wrap justify-between items-center gap-3 select-none">
                <div className="flex items-center gap-2">
                  <button
                    id="form-btn-save"
                    onClick={validateAndSave}
                    className="bg-[var(--color-odoo-teal)] hover:bg-[var(--color-odoo-teal-hover)] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-3xs cursor-pointer"
                  >
                    Save Record
                  </button>
                  <button
                    id="form-btn-cancel-discard"
                    onClick={() => {
                      setCurrentView('calendar');
                      generateOrmLog('info', `GUI Action: Discarded unsaved changes.`);
                    }}
                    className="bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-650 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Discard
                  </button>
                  
                  {/* Divider line */}
                  <span className="h-6 w-px bg-zinc-250 mx-1.5" />

                  {/* Operational controls for record state */}
                  {formState.state === 'draft' && (
                    <button
                      id="form-btn-approve-state"
                      onClick={() => handleStateChangeOnForm('confirmed')}
                      className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-250 font-bold text-[11px] px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                    >
                      Setujui Booking
                    </button>
                  )}
                  {formState.state !== 'cancelled' && (
                    <button
                      id="form-btn-cancel-state"
                      onClick={() => handleStateChangeOnForm('cancelled')}
                      className="text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-250 font-bold text-[11px] px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                    >
                      Batalkan Booking
                    </button>
                  )}
                  {formState.state !== 'draft' && (
                    <button
                      id="form-btn-draft-state"
                      onClick={() => handleStateChangeOnForm('draft')}
                      className="text-zinc-600 bg-zinc-100 hover:bg-zinc-200 border border-zinc-250 font-bold text-[11px] px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                    >
                      Set Draft / Pengajuan
                    </button>
                  )}
                </div>

                {/* State Progress labels (Right alignment) */}
                <div className="flex gap-1 text-[9px] uppercase font-bold tracking-wider font-mono">
                  <span className={`px-2.5 py-1 rounded-md ${formState.state === 'draft' ? 'bg-[#714B67] text-white shadow-3xs' : 'text-zinc-400 bg-zinc-200/50 text-[9px]'}`}>Draft</span>
                  <span className="text-zinc-300 py-1">&gt;</span>
                  <span className={`px-2.5 py-1 rounded-md ${formState.state === 'confirmed' ? 'bg-[#714B67] text-white shadow-3xs' : 'text-zinc-400 bg-zinc-200/50 text-[9px]'}`}>Confirmed</span>
                  <span className="text-zinc-300 py-1">&gt;</span>
                  <span className={`px-2.5 py-1 rounded-md ${formState.state === 'cancelled' ? 'bg-[#714B67] text-white shadow-3xs' : 'text-zinc-400 bg-zinc-200/50 text-[9px]'}`}>Cancelled</span>
                </div>
              </div>

              {/* Odoo Signature Sheet Layout */}
              <div id="form-body-sheet" className="p-5 md:p-6 lg:p-8 space-y-6 bg-white">
                
                {/* Odoo style block error alarm - styled minimally */}
                {formError && (
                  <div id="odoo-validation-notification" className="bg-rose-50 border border-rose-250 p-4 rounded-xl flex items-start gap-3">
                    <div className="bg-rose-100 p-1.5 rounded-lg text-rose-600">
                      <X className="w-4 h-4 shrink-0" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-rose-800">Odoo 17 Exception: ValidationError</h4>
                      <p className="text-xs text-rose-700 mt-1 font-mono tracking-tight leading-relaxed">{formError}</p>
                    </div>
                  </div>
                )}

                {/* sheet-envelope Title */}
                <div className="space-y-1.5">
                  <label id="form-borrower-name-label" className="text-[10px] font-mono tracking-widest text-zinc-400 block uppercase font-bold">Nama Peminjam <span className="text-rose-500">*</span></label>
                  <input
                    id="form-input-borrower"
                    type="text"
                    required
                    value={formState.borrower_name || ''}
                    onChange={(e) => setFormState(prev => ({ ...prev, borrower_name: e.target.value }))}
                    placeholder="Contoh: Budi Santoso atau Tim Dev"
                    className="w-full text-lg lg:text-xl font-bold bg-transparent border-b border-zinc-200 pb-2 focus:border-zinc-950 outline-none placeholder-zinc-300 text-zinc-900 font-display transition-colors"
                  />
                </div>

                {/* Fields Columns Grid */}
                <div id="form-fields-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-700">
                  
                  {/* Left Column (Asset Relation, Contact) */}
                  <div className="space-y-4">
                    <h3 className="font-extrabold uppercase tracking-widest text-[9px] text-zinc-400 pb-1 border-b border-zinc-200 font-mono">Informasi Aset &amp; Kontak</h3>
                    
                    <div className="flex items-center gap-4">
                      <span className="w-24 text-zinc-500 font-semibold">Relasi Aset <span className="text-rose-500">*</span></span>
                      <select
                        id="form-select-asset"
                        value={formState.asset_id || 1}
                        onChange={(e) => setFormState(prev => ({ ...prev, asset_id: Number(e.target.value) }))}
                        className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 font-bold text-zinc-800 outline-none focus:border-zinc-500"
                      >
                        {assets.map(a => (
                          <option key={a.id} value={a.id} disabled={!a.active}>
                            {a.name} {!a.active ? ' (Non-Aktif)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="w-24 text-zinc-500 font-semibold">WhatsApp <span className="text-rose-500">*</span></span>
                      <div className="flex-1 relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                          <Phone className="w-3.5 h-3.5" />
                        </span>
                        <input
                          id="form-input-wa"
                          type="text"
                          required
                          value={formState.whatsapp_number || ''}
                          onChange={(e) => setFormState(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                          placeholder="Kode negara dlm angka, exp: 62812345"
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2.5 outline-none text-zinc-800 placeholder-zinc-400 focus:border-zinc-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Start & End Durations) */}
                  <div className="space-y-4">
                    <h3 className="font-extrabold uppercase tracking-widest text-[9px] text-zinc-400 pb-1 border-b border-zinc-200 font-mono">Waktu Booking / Reservasi</h3>
                    
                    <div className="flex items-center gap-4">
                      <span className="w-24 text-zinc-500 font-semibold">Waktu Mulai <span className="text-rose-500">*</span></span>
                      <div className="flex-1 relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                          <Clock className="w-3.5 h-3.5" />
                        </span>
                        <input
                          id="form-input-start-dt"
                          type="datetime-local"
                          required
                          value={formState.start_datetime || '2026-06-05T09:00'}
                          onChange={(e) => setFormState(prev => ({ ...prev, start_datetime: e.target.value }))}
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2.5 outline-none text-zinc-800 focus:border-zinc-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="w-24 text-zinc-500 font-semibold">Waktu Selesai <span className="text-rose-500">*</span></span>
                      <div className="flex-1 relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                          <Clock className="w-3.5 h-3.5" />
                        </span>
                        <input
                          id="form-input-end-dt"
                          type="datetime-local"
                          required
                          value={formState.end_datetime || '2026-06-05T10:00'}
                          onChange={(e) => setFormState(prev => ({ ...prev, end_datetime: e.target.value }))}
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2.5 outline-none text-zinc-800 focus:border-zinc-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notebook Section (Bottom Tabs) */}
                <div id="form-notebook" className="pt-5 border-t border-zinc-200">
                  <div className="flex gap-4 border-b border-zinc-200 text-xs text-zinc-800 font-bold mb-3.5 select-none font-display">
                    <span className="pb-2 border-b-2 border-zinc-900">Tujuan Penggunaan Aset</span>
                  </div>
                  
                  <div>
                    <textarea
                      id="form-input-purpose"
                      rows={3}
                      required
                      value={formState.purpose || ''}
                      onChange={(e) => setFormState(prev => ({ ...prev, purpose: e.target.value }))}
                      placeholder="Contoh: Untuk Rapat Koordinasi dengan Direksi, peninjauan proyek luar kota..."
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 outline-none text-xs text-zinc-800 focus:border-zinc-500 leading-relaxed font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Odoo Chatter Panel Widget (Elegant decorative detail displaying logs of edits) */}
              <div id="form-chatter" className="bg-zinc-50 px-5 py-5 rounded-b-2xl border-t border-zinc-200 text-xs">
                <div className="flex items-center gap-1 text-[9px] uppercase font-bold text-zinc-455 font-mono tracking-widest mb-3.5 select-none">
                  <span>Chatter Log</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-zinc-500 font-semibold text-[11px]">
                    <div className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center font-bold text-[9px]">A</div>
                    <span>Administrator</span>
                    <span className="text-[10px] text-zinc-400 font-normal font-mono">{new Date().toLocaleString()}</span>
                  </div>
                  <p className="text-zinc-600 pl-7 leading-relaxed bg-white border border-zinc-150 p-3 rounded-xl shadow-3xs">
                    {selectedBookingId ? `Mengedit data reservasi peminjaman #${selectedBookingId}. Menjalankan evaluasi tumpang-tindih kalender.` : 'Membuka formulir input baru. Silakan isi dan simpan data peminjaman.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
