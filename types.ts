
export enum ZoomLevel {
  YEAR = 1,
  DECADE = 2,
  QUARTER_CENTURY = 3,
  ERA = 4
}

export type Theme = 'all' | 'politics' | 'science' | 'space' | 'medicine';

export interface HistoricalEvent {
  id: string;
  title: string;
  date: string; // ISO format or YYYY-MM-DD
  description: string;
  wikiLink: string;
  zoomLevel: number[]; // e.g. [1, 2, 3]
  theme?: Theme;
}

export interface ZoomConfig {
  level: ZoomLevel;
  spanYears: number;
  maxEvents: number;
  label: string;
}

export const ZOOM_CONFIGS: Record<ZoomLevel, ZoomConfig> = {
  [ZoomLevel.YEAR]: {
    level: ZoomLevel.YEAR,
    spanYears: 1,
    maxEvents: 12,
    label: "1 Year (Monthly Highlights)"
  },
  [ZoomLevel.DECADE]: {
    level: ZoomLevel.DECADE,
    spanYears: 10,
    maxEvents: 10,
    label: "10 Years (Decade-Defining)"
  },
  [ZoomLevel.QUARTER_CENTURY]: {
    level: ZoomLevel.QUARTER_CENTURY,
    spanYears: 25,
    maxEvents: 8,
    label: "25 Years (Quarter-Century)"
  },
  [ZoomLevel.ERA]: {
    level: ZoomLevel.ERA,
    spanYears: 50,
    maxEvents: 5,
    label: "50 Years (Era-Defining)"
  }
};
