
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ZoomLevel, ZOOM_CONFIGS, HistoricalEvent, Theme } from './types';
import { INITIAL_EVENTS } from './constants.tsx';
import Timeline from './components/Timeline';
import EventCard from './components/EventCard';
import { discoverEvents } from './services/geminiService';

const App: React.FC = () => {
  const [currentYear, setCurrentYear] = useState(2025);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(ZoomLevel.YEAR);
  const [filterMode, setFilterMode] = useState<ZoomLevel | 'auto'>('auto');
  const [themeFilter, setThemeFilter] = useState<Theme>('all');
  const [events, setEvents] = useState<HistoricalEvent[]>(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const zoomConfig = useMemo(() => ZOOM_CONFIGS[zoomLevel], [zoomLevel]);
  
  const effectiveFilterLevel = useMemo(() => {
    return filterMode === 'auto' ? zoomLevel : filterMode;
  }, [filterMode, zoomLevel]);

  // Check if current view has any events after theme and zoom filters
  const hasVisibleEvents = useMemo(() => {
    const endYear = currentYear + zoomConfig.spanYears;
    return events.some(e => {
      const year = new Date(e.date).getFullYear();
      const inRange = year >= currentYear && year < endYear;
      const matchesZoom = e.zoomLevel.includes(effectiveFilterLevel as number);
      const matchesTheme = themeFilter === 'all' || e.theme === themeFilter;
      return inRange && matchesZoom && matchesTheme;
    });
  }, [events, currentYear, zoomConfig, effectiveFilterLevel, themeFilter]);

  // Navigation Handlers
  const handleNext = () => {
    setCurrentYear(prev => prev + zoomConfig.spanYears);
  };

  const handlePrev = () => {
    setCurrentYear(prev => prev - zoomConfig.spanYears);
  };

  const handleZoomIn = () => {
    if (zoomLevel > ZoomLevel.YEAR) {
      setZoomLevel(prev => prev - 1);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel < ZoomLevel.ERA) {
      setZoomLevel(prev => prev + 1);
    }
  };

  // Gemini "Research" feature
  const handleResearch = async () => {
    setIsSearching(true);
    try {
      const start = currentYear;
      const end = currentYear + zoomConfig.spanYears;
      const newEvents = await discoverEvents(start, end);
      
      // Filter out duplicates
      const existingIds = new Set(events.map(e => !e.id));
      const filteredNew = newEvents.filter(e => !existingIds.has(e.id));
      
      setEvents(prev => [...prev, ...filteredNew]);
    } catch (err) {
      console.error("Research failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Export to CSV feature
  const handleExport = () => {
    const endYear = currentYear + zoomConfig.spanYears;
    const currentViewEvents = events.filter(e => {
        const y = new Date(e.date).getFullYear();
        const matchesTime = y >= currentYear && y < endYear;
        const matchesZoom = e.zoomLevel.includes(effectiveFilterLevel as number);
        const matchesTheme = themeFilter === 'all' || e.theme === themeFilter;
        return matchesTime && matchesZoom && matchesTheme;
    });

    const headers = ['ID', 'Title', 'Date', 'Description', 'Wikipedia Link', 'Theme'];
    const csvContent = [
      headers.join(','),
      ...currentViewEvents.map(e => [
        e.id,
        `"${e.title.replace(/"/g, '""')}"`,
        e.date,
        `"${e.description.replace(/"/g, '""')}"`,
        e.wikiLink,
        e.theme || 'general'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `historical_events_${currentYear}_to_${endYear}_${themeFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* HUGE NOTIFICATION DISCLAIMER */}
      <div className="bg-red-600 text-white py-3 px-6 text-center animate-pulse sticky top-0 z-[100] shadow-2xl flex items-center justify-center gap-4">
        <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div className="font-black text-lg md:text-xl uppercase tracking-tighter">
          NOTICE: This app does NOT tell the truth. The dates are totally wrong.
        </div>
        <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 serif">ChronosLens</h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Interactive Historiography Tool</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="px-4 py-2 bg-gray-100 rounded-full flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Scale:</span>
              <span className="text-sm font-semibold text-amber-700">{zoomConfig.label}</span>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="theme-filter" className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Theme:</label>
              <select 
                id="theme-filter"
                value={themeFilter}
                onChange={(e) => setThemeFilter(e.target.value as Theme)}
                className="bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2 px-3 shadow-sm outline-none cursor-pointer"
              >
                <option value="all">All Themes</option>
                <option value="politics">Politics</option>
                <option value="science">Science</option>
                <option value="space">Space</option>
                <option value="medicine">Medicine</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="granularity-filter" className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Zoom:</label>
              <select 
                id="granularity-filter"
                value={filterMode}
                onChange={(e) => {
                  const val = e.target.value;
                  setFilterMode(val === 'auto' ? 'auto' : parseInt(val));
                }}
                className="bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2 px-3 shadow-sm outline-none cursor-pointer"
              >
                <option value="auto">Auto (Match Scale)</option>
                <option value={ZoomLevel.YEAR}>Monthly Highlights</option>
                <option value={ZoomLevel.DECADE}>Decade-Defining</option>
                <option value={ZoomLevel.QUARTER_CENTURY}>Quarter-Century</option>
                <option value={ZoomLevel.ERA}>Era-Defining</option>
              </select>
            </div>

            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-600 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl border border-gray-100 p-8 flex flex-col gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-amber-50 rounded-full opacity-50 blur-3xl pointer-events-none"></div>

          {/* Time Navigation Bar */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-6 relative z-10">
            <button 
              onClick={handlePrev}
              className="p-3 rounded-full hover:bg-amber-50 text-amber-700 transition-colors group"
            >
              <svg className="w-6 h-6 transform group-active:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 serif tracking-tight">
                {zoomConfig.spanYears === 1 
                  ? currentYear 
                  : `${currentYear} — ${currentYear + zoomConfig.spanYears - 1}`}
              </h2>
              {themeFilter !== 'all' && (
                <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mt-2">
                  Thematic: {themeFilter}
                </p>
              )}
            </div>

            <button 
              onClick={handleNext}
              className="p-3 rounded-full hover:bg-amber-50 text-amber-700 transition-colors group"
            >
              <svg className="w-6 h-6 transform group-active:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Timeline Visualization */}
          <Timeline 
            currentYear={currentYear} 
            zoomConfig={zoomConfig} 
            events={events} 
            filterLevel={effectiveFilterLevel as number}
            themeFilter={themeFilter}
            onEventClick={setSelectedEvent}
            isSearching={isSearching}
            onResearch={handleResearch}
          />

          {/* Bottom Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-gray-100 relative z-10">
            <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-xl">
              <button 
                onClick={handleZoomOut}
                disabled={zoomLevel === ZoomLevel.ERA}
                className="px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
                Scale Out
              </button>
              <button 
                onClick={handleZoomIn}
                disabled={zoomLevel === ZoomLevel.YEAR}
                className="px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
                Scale In
              </button>
            </div>

            <button 
              onClick={handleResearch}
              disabled={isSearching}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-md ${isSearching ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-amber-600 text-white hover:bg-amber-700 hover:shadow-lg active:scale-95'} ${!hasVisibleEvents && !isSearching ? 'animate-bounce' : ''}`}
            >
              {isSearching ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              )}
              {isSearching ? 'Discovering...' : !hasVisibleEvents ? `Generate Events for ${zoomConfig.spanYears === 1 ? currentYear : 'this era'}` : 'Discover More via Gemini'}
            </button>
          </div>
        </div>

        <div className="mt-8 max-w-4xl text-center">
          <p className="text-gray-400 text-sm italic">
            Navigating history at scale. Use Scale controls to change time window size, and use the "Theme" filter to focus on specific domains like <strong>Politics, Science, Space, or Medicine</strong>.
          </p>
        </div>
      </main>

      <footer className="py-8 px-6 text-center text-gray-400 text-xs border-t border-gray-200 bg-white">
        © 2025 ChronosLens Research Group • Dynamic Historiography Visualization Tool
      </footer>

      <EventCard event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
};

export default App;
