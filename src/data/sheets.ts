// src/data/sheets.ts

export interface ArtPiece {
  title: string;
  filename: string;
  category: string;
  render_type: string;
  background: string;
  body_type: string;
  date: string;
}
export interface PricingTier {
  tier: string;
  original_price: string;
  discount_price: string;
  description: string;
  features: string;
}
export interface TOSItem {
  type: string;
  order: string;
  title: string;
  content: string;
  update_date: string;
}
export interface YCHPiece {
  title: string;
  filename: string;
  price: string;
  body_type: string;
  original_price?: string;
  num_chars?: string;
  difficult_level?: string;
}
export interface GuidelineItem {
  type: 'DO' | 'DONT';
  content: string;
}

export const GOOGLE_FORM_URL = 'https://forms.gle/QLrFdUaHsva3t8Dg8';

const BASE_RAW_URL = 'https://raw.githubusercontent.com/Tarquitet/JSON-ServersData/main/Commissions-web';

// Caché en memoria por tipo de archivo
const cache: Record<string, any> = {};
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutos
const cacheTimestamps: Record<string, number> = {};

async function fetchJSONFile(filename: string): Promise<any> {
  const now = Date.now();
  if (cache[filename] && now - cacheTimestamps[filename] < CACHE_DURATION_MS) {
    return cache[filename];
  }

  try {
    const res = await fetch(`${BASE_RAW_URL}/${filename}?t=${now}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

    const data = await res.json();
    cache[filename] = data;
    cacheTimestamps[filename] = now;
    return data;
  } catch (err) {
    console.error(`Error obteniendo ${filename} de GitHub Raw:`, err);
    return cache[filename] || []; // Fallback a caché antigua o vacío
  }
}

// ============================================================================
// FETCHERS MASTICADOS (Idénticos a los que ya usan tus componentes)
// ============================================================================

export async function getSheetArtworks(limit: number = 50, offset: number = 0): Promise<ArtPiece[]> {
  const data = await fetchJSONFile('portfolio.json');
  return ((data as ArtPiece[]) || [])
    .sort((a, b) => parseInt(b.date || '0') - parseInt(a.date || '0'))
    .slice(offset, offset + limit);
}

export async function getSheetPrices(): Promise<PricingTier[]> {
  return ((await fetchJSONFile('prices.json')) as PricingTier[]) || [];
}

export async function getSheetTOS(): Promise<{
  startBlock: TOSItem | null;
  finalBlock: TOSItem | null;
  listItems: TOSItem[];
}> {
  const data = ((await fetchJSONFile('tos.json')) as TOSItem[]) || [];
  return {
    startBlock: data.find((t) => t.type === 'S') || null,
    finalBlock: data.find((t) => t.type === 'F') || null,
    listItems: data.filter((t) => t.type === 'I'),
  };
}

export async function getSheetYCH(): Promise<YCHPiece[]> {
  const data = ((await fetchJSONFile('ych.json')) as YCHPiece[]) || [];
  return data.filter((item) => item.title && item.filename);
}

export async function getSheetGuidelines(): Promise<{ allowed: GuidelineItem[]; restricted: GuidelineItem[] }> {
  const data = ((await fetchJSONFile('guidelines.json')) as GuidelineItem[]) || [];
  return {
    allowed: data.filter((i) => i.type?.toUpperCase().trim() === 'DO'),
    restricted: data.filter((i) => i.type?.toUpperCase().trim() === 'DONT'),
  };
}
