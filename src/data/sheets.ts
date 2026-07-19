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
const APPS_SCRIPT_API_URL =
  'https://script.google.com/macros/s/AKfycbxAAoOqRdksC0KDrjT7u6plGV3iz75cz5E6Ht_C4efVO8o-iY3sGttFwHye8BC65RNH/exec';

const CACHE_DURATION_MS = 5 * 60 * 1000;
const fetchCache = new Map<string, Promise<any>>();

async function fetchSheetData(sheetName: string): Promise<any[]> {
  if (typeof window !== 'undefined') {
    const cachedItem = sessionStorage.getItem(`btc_data_${sheetName}`);
    if (cachedItem) {
      try {
        const { timestamp, data } = JSON.parse(cachedItem);
        if (Date.now() - timestamp < CACHE_DURATION_MS) {
          return data;
        }
      } catch (e) {
        sessionStorage.removeItem(`btc_data_${sheetName}`);
      }
    }
  }

  if (!fetchCache.has(sheetName)) {
    const url = `${APPS_SCRIPT_API_URL}?sheet=${sheetName}`;
    const promise = fetch(url, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`Error API: ${sheetName}`);
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        const finalData = Array.isArray(data) ? data : [];
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`btc_data_${sheetName}`, JSON.stringify({ timestamp: Date.now(), data: finalData }));
        }
        return finalData;
      })
      .catch((err) => {
        console.error(`API Error en ${sheetName}:`, err);
        return [];
      })
      .finally(() => setTimeout(() => fetchCache.delete(sheetName), 1000));

    fetchCache.set(sheetName, promise);
  }
  return fetchCache.get(sheetName)!;
}

// ============================================================================
// FETCHERS MASTICADOS (Optimizados para cada componente)
// ============================================================================

export async function getSheetArtworks(limit: number = 50, offset: number = 0): Promise<ArtPiece[]> {
  const data = await fetchSheetData('portfolio');
  // Ordenado cronológicamente desde aquí
  return data.sort((a, b) => parseInt(b.date) - parseInt(a.date)).slice(offset, offset + limit);
}

export async function getSheetPrices(): Promise<PricingTier[]> {
  const data = await fetchSheetData('prices');
  return data as PricingTier[];
}

export async function getSheetTOS(): Promise<{
  startBlock: TOSItem | null;
  finalBlock: TOSItem | null;
  listItems: TOSItem[];
}> {
  const tos = await fetchSheetData('tos');
  return {
    startBlock: tos.find((t: TOSItem) => t.type === 'S') || null,
    finalBlock: tos.find((t: TOSItem) => t.type === 'F') || null,
    listItems: tos.filter((t: TOSItem) => t.type === 'I'),
  };
}

export async function getSheetYCH(): Promise<YCHPiece[]> {
  const ychList = await fetchSheetData('ych');
  return (ychList as YCHPiece[]).filter((item) => item.title && item.filename);
}

export async function getSheetGuidelines(): Promise<{
  allowed: GuidelineItem[];
  restricted: GuidelineItem[];
}> {
  const guidelines = await fetchSheetData('guidelines');
  const items = guidelines as GuidelineItem[];
  return {
    allowed: items.filter((i) => i.type?.toUpperCase().trim() === 'DO'),
    restricted: items.filter((i) => i.type?.toUpperCase().trim() === 'DONT'),
  };
}
