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

export interface ExtraItem {
  name: string;
  price: string;
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
}

export interface GuidelineItem {
  type: 'DO' | 'DONT';
  content: string;
}

export interface CalcOption {
  category: string;
  label: string;
  value: string;
  value_discount: string;
}

// URL DEL FORMULARIO DE GOOGLE PARA COMISIONAR
export const GOOGLE_FORM_URL = 'https://forms.gle/QLrFdUaHsva3t8Dg8';

// URLs BASE
const BASE_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQlmh6ewrKoqQ_H35C-6QRHrI5OdzfA8ZDrZZohRxGr-m0NP-1300tvufqQeu3sKfAKQRQR68F_-_l4/pub?output=csv';

const GIDS = {
  ART: '0',
  PRICING: '835010888',
  EXTRAS: '1100543912',
  TOS: '299036177',
  YCH: '151722103',
  GUIDELINES: '1007742108',
  CALCULATOR: '1138422431',
};

// ============================================================================
// VARIABLES DE MEMORIA (CACHÉ INTERNO DEL CÓDIGO)
// ============================================================================
let artworksCache: Promise<ArtPiece[]> | null = null;
let pricesCache: Promise<PricingTier[]> | null = null;
let extrasCache: Promise<ExtraItem[]> | null = null;
let tosCache: Promise<TOSItem[]> | null = null;
let ychCache: Promise<YCHPiece[]> | null = null;
let guidelinesCache: Promise<GuidelineItem[]> | null = null;
let calcConfigCache: Promise<CalcOption[]> | null = null;

// ============================================================================
// FUNCIÓN DE AYUDA: FETCH ANTICACHÉ
// ============================================================================
async function fetchFreshCSV(gid: string): Promise<string[][]> {
  // Añadimos un parámetro de tiempo único (&t=...) para engañar al caché
  const timestamp = new Date().getTime();
  const url = `${BASE_URL}&gid=${gid}&cache_buster=${timestamp}`;

  try {
    const response = await fetch(url, {
      cache: 'no-store', // Instrucción directa al navegador para no guardar copia
      headers: { pragma: 'no-cache', 'cache-control': 'no-cache' },
    });

    if (!response.ok) return [];
    const text = await response.text();
    return parseCSV(text);
  } catch (e) {
    console.error(`Error en fetch para GID ${gid}:`, e);
    return [];
  }
}

// ============================================================================
// MOTOR DE LECTURA CSV
// ============================================================================
function parseCSV(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else if (char === '\n' && !inQuotes) {
      row.push(current.trim());
      if (row.some((cell) => cell !== '')) result.push(row);
      row = [];
      current = '';
    } else if (char === '\r' && !inQuotes) {
      // Ignorar
    } else {
      current += char;
    }
  }

  if (current !== '' || row.length > 0) {
    row.push(current.trim());
    if (row.some((cell) => cell !== '')) result.push(row);
  }
  return result;
}

// ============================================================================
// FETCHERS ACTUALIZADOS (AHORA CON MEMORIA)
// ============================================================================

export function getSheetArtworks(): Promise<ArtPiece[]> {
  if (!artworksCache) {
    artworksCache = (async () => {
      const data = await fetchFreshCSV(GIDS.ART);
      if (data.length < 2) return [];
      const headers = data[0];
      return data
        .slice(1)
        .map((row) => {
          const obj: any = {};
          headers.forEach((h, i) => {
            obj[h.toLowerCase().trim()] = row[i] || '';
          });
          return obj as ArtPiece;
        })
        .filter((item) => item.title && item.date && item.filename)
        .sort((a, b) => parseInt(b.date) - parseInt(a.date));
    })();
  }
  return artworksCache;
}

export function getSheetPrices(): Promise<PricingTier[]> {
  if (!pricesCache) {
    pricesCache = (async () => {
      const data = await fetchFreshCSV(GIDS.PRICING);
      if (data.length < 2) return [];
      const headers = data[0];
      return data.slice(1).map((row) => {
        const obj: any = {};
        headers.forEach((h, i) => {
          obj[h.toLowerCase().trim()] = row[i] || '';
        });
        return obj as PricingTier;
      });
    })();
  }
  return pricesCache;
}

export function getSheetExtras(): Promise<ExtraItem[]> {
  if (!extrasCache) {
    extrasCache = (async () => {
      const data = await fetchFreshCSV(GIDS.EXTRAS);
      if (data.length < 2) return [];
      const headers = data[0];
      return data.slice(1).map((row) => {
        const obj: any = {};
        headers.forEach((h, i) => {
          obj[h.toLowerCase().trim()] = row[i] || '';
        });
        return obj as ExtraItem;
      });
    })();
  }
  return extrasCache;
}

export function getSheetTOS(): Promise<TOSItem[]> {
  if (!tosCache) {
    tosCache = (async () => {
      const data = await fetchFreshCSV(GIDS.TOS);
      if (data.length < 2) return [];
      const headers = data[0];
      return data
        .slice(1)
        .map((row) => {
          const obj: any = {};
          headers.forEach((h, i) => {
            obj[h.toLowerCase().trim()] = row[i] || '';
          });
          if (!obj.type) obj.type = 'I';
          return obj as TOSItem;
        })
        .sort((a, b) => parseInt(a.order || '0') - parseInt(b.order || '0'));
    })();
  }
  return tosCache;
}

export function getSheetYCH(): Promise<YCHPiece[]> {
  if (!ychCache) {
    ychCache = (async () => {
      const data = await fetchFreshCSV(GIDS.YCH);
      if (data.length < 2) return [];
      const headers = data[0];
      return data
        .slice(1)
        .map((row) => {
          const obj: any = {};
          headers.forEach((h, i) => {
            obj[h.toLowerCase().trim()] = row[i] || '';
          });
          return obj as YCHPiece;
        })
        .filter((item) => item.title && item.filename);
    })();
  }
  return ychCache;
}

export function getSheetGuidelines(): Promise<GuidelineItem[]> {
  if (!guidelinesCache) {
    guidelinesCache = (async () => {
      const data = await fetchFreshCSV(GIDS.GUIDELINES);
      if (data.length < 2) return [];
      const headers = data[0];
      return data.slice(1).map((row) => {
        const obj: any = {};
        headers.forEach((h, i) => {
          obj[h.toLowerCase().trim()] = row[i] || '';
        });
        return obj as GuidelineItem;
      });
    })();
  }
  return guidelinesCache;
}

export function getCalculatorConfig(): Promise<CalcOption[]> {
  if (!calcConfigCache) {
    calcConfigCache = (async () => {
      const data = await fetchFreshCSV(GIDS.CALCULATOR);
      if (data.length < 2) return [];
      const headers = data[0].map((h) => h.toLowerCase().trim());
      return data.slice(1).map((row) => {
        const obj: any = {};
        headers.forEach((h, i) => {
          obj[h] = row[i] || '';
        });
        return obj as CalcOption;
      });
    })();
  }
  return calcConfigCache;
}
