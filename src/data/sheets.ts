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

// URL Base usando jsDelivr (Evita el error 503 de GitHub Raw)
const BASE_URL = 'https://cdn.jsdelivr.net/gh/Tarquitet/JSON-ServersData@main/Commissions-web';

// Caché en memoria por tipo de archivo
const cache: Record<string, any> = {};
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutos
const cacheTimestamps: Record<string, number> = {};

// ✅ AHORA (Lee la URL directamente, igual que el Layout y el content.ts)
const getCurrentLang = (): 'es' | 'en' => {
  if (typeof window !== 'undefined') {
    return window.location.pathname.startsWith('/en') ? 'en' : 'es';
  }
  return 'es';
};

// ✅ FUNCIÓN ACTUALIZADA: Ahora acepta el parámetro 'isLocalized'
async function fetchJSONFile(filename: string, isLocalized: boolean = false): Promise<any> {
  const now = Date.now();
  const lang = getCurrentLang();

  // La clave del caché DEBE incluir el idioma si el archivo es localizado
  const cacheKey = isLocalized ? `${filename}_${lang}` : filename;

  if (cache[cacheKey] && now - cacheTimestamps[cacheKey] < CACHE_DURATION_MS) {
    return cache[cacheKey];
  }

  try {
    // Construir la URL correcta según si es estático o localizado
    const url = isLocalized ? `${BASE_URL}/${lang}/${filename}?t=${now}` : `${BASE_URL}/${filename}?t=${now}`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

    const data = await res.json();
    cache[cacheKey] = data;
    cacheTimestamps[cacheKey] = now;
    return data;
  } catch (err) {
    console.error(`Error obteniendo ${filename}:`, err);
    return cache[cacheKey] || []; // Fallback a caché antigua o vacío
  }
}

// ============================================================================
// FETCHERS MASTICADOS
// ============================================================================

// ✅ ESTÁTICOS (isLocalized = false) -> Busca en: Commissions-web/portfolio.json
export async function getSheetArtworks(limit: number = 50, offset: number = 0): Promise<ArtPiece[]> {
  const data = await fetchJSONFile('portfolio.json', false);
  return ((data as ArtPiece[]) || [])
    .sort((a, b) => parseInt(b.date || '0') - parseInt(a.date || '0'))
    .slice(offset, offset + limit);
}

// ✅ ESTÁTICOS (isLocalized = false) -> Busca en: Commissions-web/ych.json
export async function getSheetYCH(): Promise<YCHPiece[]> {
  const data = await fetchJSONFile('ych.json', false);
  return ((data as YCHPiece[]) || []).filter((item) => item.title && item.filename);
}

// ✅ LOCALIZADOS (isLocalized = true) -> Busca en: Commissions-web/es/prices.json o /en/prices.json
export async function getSheetPrices(): Promise<PricingTier[]> {
  return ((await fetchJSONFile('prices.json', true)) as PricingTier[]) || [];
}

// ✅ LOCALIZADOS (isLocalized = true) -> Busca en: Commissions-web/es/tos.json o /en/tos.json
export async function getSheetTOS(): Promise<{
  startBlock: TOSItem | null;
  finalBlock: TOSItem | null;
  listItems: TOSItem[];
}> {
  const data = ((await fetchJSONFile('tos.json', true)) as TOSItem[]) || [];
  return {
    startBlock: data.find((t) => t.type === 'S') || null,
    finalBlock: data.find((t) => t.type === 'F') || null,
    listItems: data.filter((t) => t.type === 'I'),
  };
}

// ✅ LOCALIZADOS (isLocalized = true) -> Busca en: Commissions-web/es/guidelines.json o /en/guidelines.json
export async function getSheetGuidelines(): Promise<{ allowed: GuidelineItem[]; restricted: GuidelineItem[] }> {
  const data = ((await fetchJSONFile('guidelines.json', true)) as GuidelineItem[]) || [];
  return {
    allowed: data.filter((i) => i.type?.toUpperCase().trim() === 'DO'),
    restricted: data.filter((i) => i.type?.toUpperCase().trim() === 'DONT'),
  };
}
