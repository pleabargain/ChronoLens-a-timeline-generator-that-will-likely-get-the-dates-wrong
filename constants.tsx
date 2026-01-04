
import { HistoricalEvent } from './types';

export const INITIAL_EVENTS: HistoricalEvent[] = [
  // 2025 Events (Granular Level 1)
  {
    id: "2025_osaka_expo",
    title: "Expo 2025 Osaka",
    date: "2025-04-13",
    description: "The World Expo opens in Osaka, Japan, focusing on 'Designing Future Society for Our Lives' and sustainable technologies.",
    wikiLink: "https://en.wikipedia.org/wiki/Expo_2025",
    zoomLevel: [1, 2],
    theme: 'science'
  },
  {
    id: "2025_artemis_ii",
    title: "NASA Artemis II Mission",
    date: "2025-09-01",
    description: "The first crewed mission of NASA's Artemis program plans to orbit the Moon, marking a major milestone for deep space exploration.",
    wikiLink: "https://en.wikipedia.org/wiki/Artemis_2",
    zoomLevel: [1, 2, 3],
    theme: 'space'
  },
  {
    id: "2025_quantum_year",
    title: "Int'l Year of Quantum Science",
    date: "2025-01-01",
    description: "The UN officially observes the International Year of Quantum Science and Technology to celebrate the century of quantum mechanics.",
    wikiLink: "https://en.wikipedia.org/wiki/International_Year_of_Quantum_Science_and_Technology",
    zoomLevel: [1],
    theme: 'science'
  },
  {
    id: "2025_wwii_anniversary",
    title: "80th Anniversary of WWII End",
    date: "2025-05-08",
    description: "Global commemorations mark the 80th anniversary of the end of the Second World War in Europe.",
    wikiLink: "https://en.wikipedia.org/wiki/Victory_in_Europe_Day",
    zoomLevel: [1],
    theme: 'politics'
  },
  {
    id: "2025_fusion_milestone",
    title: "ITER First Plasma Target",
    date: "2025-12-01",
    description: "The International Thermonuclear Experimental Reactor (ITER) works toward critical operational milestones in sustainable fusion energy.",
    wikiLink: "https://en.wikipedia.org/wiki/ITER",
    zoomLevel: [1, 2],
    theme: 'science'
  },
  {
    id: "2025_vatican_jubilee",
    title: "Vatican Jubilee 2025",
    date: "2024-12-24", // Starts late 2024, significant throughout 2025
    description: "The Catholic Church celebrates the Ordinary Jubilee under the theme 'Pilgrims of Hope', drawing millions to Rome.",
    wikiLink: "https://en.wikipedia.org/wiki/2025_Jubilee",
    zoomLevel: [1],
    theme: 'politics'
  },
  {
    id: "2025_cop30_prep",
    title: "COP30 Climate Preparations",
    date: "2025-11-01",
    description: "World leaders prepare for the 30th UN Climate Change Conference in Brazil, emphasizing Amazon rainforest protection.",
    wikiLink: "https://en.wikipedia.org/wiki/United_Nations_Climate_Change_conference",
    zoomLevel: [1],
    theme: 'politics'
  },
  {
    id: "2025_eu_expansion",
    title: "EU Enlargement Negotiations",
    date: "2025-03-15",
    description: "Significant diplomatic shifts occur as the European Union advances membership talks with Western Balkan candidates.",
    wikiLink: "https://en.wikipedia.org/wiki/Enlargement_of_the_European_Union",
    zoomLevel: [1],
    theme: 'politics'
  },
  {
    id: "2025_james_webb_discoveries",
    title: "JWST Early Universe Findings",
    date: "2025-07-20",
    description: "The James Webb Space Telescope releases a groundbreaking study on the formation of the first galaxies after the Big Bang.",
    wikiLink: "https://en.wikipedia.org/wiki/James_Webb_Space_Telescope",
    zoomLevel: [1],
    theme: 'space'
  },
  {
    id: "2025_generic_ai_regulation",
    title: "Global AI Safety Accord",
    date: "2025-06-10",
    description: "A major international treaty is signed to establish ethical guidelines and safety protocols for advanced Generative AI models.",
    wikiLink: "https://en.wikipedia.org/wiki/Regulation_of_artificial_intelligence",
    zoomLevel: [1, 2],
    theme: 'science'
  },
  {
    id: "2025_moon_mining_legal",
    title: "Lunar Resource Framework",
    date: "2025-10-22",
    description: "International space agencies agree on a preliminary legal framework for the extraction and use of lunar water and minerals.",
    wikiLink: "https://en.wikipedia.org/wiki/Lunar_resources",
    zoomLevel: [1],
    theme: 'space'
  },
  {
    id: "2025_hydrogen_aviation",
    title: "First Commercial Hydrogen Flight",
    date: "2025-08-14",
    description: "A regional airline successfully completes the first commercial demonstration of a long-range hydrogen-powered passenger aircraft.",
    wikiLink: "https://en.wikipedia.org/wiki/Hydrogen-powered_aircraft",
    zoomLevel: [1],
    theme: 'science'
  },
  // 2023 - 2024 Milestones
  {
    id: "2023_crispr_approval",
    title: "First CRISPR Therapy Approval",
    date: "2023-11-15",
    description: "The UK's MHRA became the first regulator in the world to approve Casgevy, a CRISPR-based gene editing therapy for sickle-cell disease and beta thalassemia.",
    wikiLink: "https://en.wikipedia.org/wiki/Exagamglogene_autotemcel",
    zoomLevel: [1, 2, 3],
    theme: 'medicine'
  },
  // Historic Reference Events
  {
    id: "1989_berlin_wall",
    title: "Fall of the Berlin Wall",
    date: "1989-11-09",
    description: "The opening of the East German borders leading to the demolition of the Wall and German reunification.",
    wikiLink: "https://en.wikipedia.org/wiki/Fall_of_the_Berlin_Wall",
    zoomLevel: [1, 2, 3, 4],
    theme: 'politics'
  },
  {
    id: "2001_911_attacks",
    title: "September 11 Attacks",
    date: "2001-09-11",
    description: "A series of coordinated terrorist attacks by al-Qaeda strike the United States.",
    wikiLink: "https://en.wikipedia.org/wiki/September_11_attacks",
    zoomLevel: [1, 2, 3, 4],
    theme: 'politics'
  },
  {
    id: "2020_covid_pandemic",
    title: "COVID-19 Pandemic",
    date: "2020-03-11",
    description: "The WHO declares COVID-19 a pandemic, leading to global lockdowns and shifts in human history.",
    wikiLink: "https://en.wikipedia.org/wiki/COVID-19_pandemic",
    zoomLevel: [1, 2, 3, 4],
    theme: 'medicine'
  }
];
