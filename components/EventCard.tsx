
import React from 'react';
import { HistoricalEvent } from '../types';

interface EventCardProps {
  event: HistoricalEvent | null;
  onClose: () => void;
}

const THEME_LABELS: Record<string, string> = {
  politics: 'Political Milestone',
  science: 'Scientific Breakthrough',
  space: 'Space Exploration',
  medicine: 'Medical Advancement',
  general: 'Historical Milestone'
};

const EventCard: React.FC<EventCardProps> = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-2 py-1 text-[10px] font-bold bg-amber-100 text-amber-800 rounded uppercase tracking-wider">
                  {THEME_LABELS[event.theme || 'general']}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Source: Wikipedia
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 serif">{event.title}</h2>
              <p className="text-gray-500 font-medium">{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="text-gray-700 leading-relaxed mb-6 italic border-l-4 border-amber-500 pl-4 py-1">
            {event.description}
          </p>

          <div className="flex gap-3">
            <a 
              href={event.wikiLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-xl text-center transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2zm4 8h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              View Full Article
            </a>
            <button 
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
