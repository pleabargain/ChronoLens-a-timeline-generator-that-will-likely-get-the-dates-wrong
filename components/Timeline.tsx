
import React from 'react';
import * as d3 from 'd3';
import { HistoricalEvent, ZoomLevel, ZoomConfig, ZOOM_CONFIGS, Theme } from '../types';

interface TimelineProps {
  currentYear: number;
  zoomConfig: ZoomConfig;
  events: HistoricalEvent[];
  filterLevel: number;
  themeFilter: Theme;
  onEventClick: (event: HistoricalEvent) => void;
  isSearching?: boolean;
  onResearch?: () => void;
}

const THEME_COLORS: Record<string, string> = {
  politics: 'bg-red-500 border-red-600',
  science: 'bg-blue-500 border-blue-600',
  space: 'bg-purple-600 border-purple-700',
  medicine: 'bg-emerald-500 border-emerald-600',
  general: 'bg-amber-500 border-amber-600'
};

const THEME_TEXT_COLORS: Record<string, string> = {
  politics: 'text-red-600',
  science: 'text-blue-600',
  space: 'text-purple-600',
  medicine: 'text-emerald-600',
  general: 'text-amber-600'
};

const Timeline: React.FC<TimelineProps> = ({ 
  currentYear, 
  zoomConfig, 
  events, 
  filterLevel, 
  themeFilter,
  onEventClick,
  isSearching,
  onResearch
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const endYear = currentYear + zoomConfig.spanYears;

  const filterConfig = ZOOM_CONFIGS[filterLevel as ZoomLevel];
  const effectiveMaxEvents = Math.max(zoomConfig.maxEvents, filterConfig?.maxEvents || 0);

  const visibleEvents = events
    .filter(e => {
      const year = new Date(e.date).getFullYear();
      const inRange = year >= currentYear && year < endYear;
      const correctZoom = e.zoomLevel.includes(filterLevel);
      const matchesTheme = themeFilter === 'all' || e.theme === themeFilter;
      return inRange && correctZoom && matchesTheme;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, effectiveMaxEvents);

  const xScale = d3.scaleTime()
    .domain([new Date(currentYear, 0, 1), new Date(endYear, 0, 1)])
    .range([0, 100]);

  return (
    <div className="relative w-full h-80 py-12 px-8 flex flex-col justify-center" ref={containerRef}>
      {/* Main Axis */}
      <div className="absolute left-8 right-8 h-1 bg-gray-200 top-1/2 -translate-y-1/2 rounded-full shadow-inner overflow-visible">
        <div className="absolute left-0 top-0 h-full bg-amber-200/50 rounded-full w-full opacity-50"></div>

        {/* Ticks/Markers for Time Scale */}
        <div className="absolute w-full h-full flex justify-between pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => {
            const tickYear = currentYear + (i * zoomConfig.spanYears / 5);
            return (
              <div key={i} className="flex flex-col items-center">
                <div className="h-4 w-0.5 bg-gray-300 mt-[-8px]"></div>
                <span className="text-xs font-bold text-gray-400 mt-2">{Math.floor(tickYear)}</span>
              </div>
            );
          })}
        </div>

        {/* Event Markers */}
        {visibleEvents.map((event) => {
          const xPos = xScale(new Date(event.date));
          const isOdd = visibleEvents.indexOf(event) % 2 === 0;
          const themeColor = THEME_COLORS[event.theme || 'general'];
          const themeTextColor = THEME_TEXT_COLORS[event.theme || 'general'];
          
          return (
            <div 
              key={event.id}
              className="absolute group transition-all duration-300"
              style={{ left: `${xPos}%`, top: '50%' }}
            >
              <button
                onClick={() => onEventClick(event)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-4 shadow-lg hover:scale-150 transition-all z-20 ${themeColor.split(' ')[1]}`}
              >
                <div className="absolute w-2 h-2 bg-white rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-transform"></div>
              </button>

              {/* Rollover Label */}
              <div 
                className={`absolute left-0 w-36 -translate-x-1/2 transition-all opacity-0 group-hover:opacity-100 group-hover:z-30 pointer-events-none group-hover:pointer-events-auto ${isOdd ? 'bottom-8' : 'top-8'}`}
              >
                <div className={`p-2.5 bg-white border border-gray-100 rounded-lg shadow-xl transition-all group-hover:-translate-y-1 flex flex-col gap-1`}>
                  <div className="flex justify-between items-center mb-0.5">
                    <p className={`text-[10px] font-bold uppercase tracking-tighter ${themeTextColor}`}>
                      {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                    <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                      {event.theme || 'general'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight">
                    {event.title}
                  </p>
                  
                  <a 
                    href={event.wikiLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors border-t border-gray-100 pt-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2zm4 8h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                    Wikipedia
                  </a>
                </div>
                <div className={`absolute left-1/2 -translate-x-1/2 w-0.5 opacity-50 transition-all ${isOdd ? 'h-4 top-full' : 'h-4 bottom-full'} ${themeColor.split(' ')[0]}`}></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {visibleEvents.length === 0 && (
        <div className="text-center z-10">
          <p className="text-gray-400 italic mb-4">
            No {themeFilter !== 'all' ? themeFilter : ''} events found for {zoomConfig.spanYears === 1 ? currentYear : 'this period'} at this granularity.
          </p>
          {!isSearching && onResearch && (
            <button 
              onClick={onResearch}
              className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold hover:bg-amber-100 transition-colors uppercase tracking-wider shadow-sm"
            >
              Click to discover at least 12 events
            </button>
          )}
          {isSearching && (
            <div className="flex items-center justify-center gap-2 text-amber-600 text-sm font-medium animate-pulse">
               <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Researching {themeFilter !== 'all' ? themeFilter : 'historical'} milestones...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Timeline;
