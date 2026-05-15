// sheets.ts

// ============================================================================
// INTERFACES (DEFINICIONES DE DATOS)
// ============================================================================
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
  original_price?: string;
  num_chars?: string;
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

export interface DiscountConfig {
  isActive: boolean;
  percentage: number;
  endDate: string;
}

// ============================================================================
// CONFIGURACIÓN Y GIDs
// ============================================================================
export const GOOGLE_FORM_URL = 'https://forms.gle/QLrFdUaHsva3t8Dg8';

// El ID extraído de tu URL de edición
const SHEET_ID = '1BJWqRCCR8fXoGahiqDJTna-2DZAV23JRo0YSc3QiY5Y';

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
// CACHÉ EN MEMORIA
// ============================================================================
let artworksCache: Promise<ArtPiece[]> | null = null;
let pricesCache: Promise<PricingTier[]> | null = null;
let extrasCache: Promise<ExtraItem[]> | null = null;
let tosCache: Promise<TOSItem[]> | null = null;
let ychCache: Promise<YCHPiece[]> | null = null;
let guidelinesCache: Promise<GuidelineItem[]> | null = null;
let calcConfigCache: Promise<CalcOption[]> | null = null;

// ============================================================================
// MOTOR DE CONSULTAS SQL (GVIZ)
// ============================================================================
async function fetchSheetQuery(gid: string, query: string = 'SELECT *'): Promise<string[][]> {
  const timestamp = new Date().getTime();
  // Usamos el endpoint gviz/tq para permitir filtrado SQL y evitar caché vieja
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}&tq=${encodeURIComponent(query)}&cache_buster=${timestamp}`;

  try {
    const response = await fetch(url, {
      cache: 'no-store',
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
// MOTOR DE LECTURA CSV (TU PARSER ORIGINAL)
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
// FETCHERS (MANTIENEN LA FIRMA PARA EL RESTO DEL CÓDIGO)
// ============================================================================

export function getSheetArtworks(limit: number = 50, offset: number = 0): Promise<ArtPiece[]> {
  // Optimizamos: Si no hay offset, usamos el caché. Si hay paginación, pedimos nuevo.
  if (!artworksCache || offset > 0) {
    const query = `SELECT A, B, C, D, E, F, G WHERE A IS NOT NULL ORDER BY G DESC LIMIT ${limit} OFFSET ${offset}`;
    const promise = (async () => {
      const data = await fetchSheetQuery(GIDS.ART, query);
      if (data.length < 2) return [];
      const headers = data[0].map((h) => h.toLowerCase().trim());
      return data.slice(1).map((row) => {
        const obj: any = {};
        headers.forEach((h, i) => {
          obj[h] = row[i] || '';
        });
        return obj as ArtPiece;
      });
    })();

    if (offset === 0) artworksCache = promise;
    return promise;
  }
  return artworksCache;
}

export function getSheetPrices(): Promise<PricingTier[]> {
  if (!pricesCache) {
    pricesCache = (async () => {
      const data = await fetchSheetQuery(GIDS.PRICING, 'SELECT A, B, C, D, E WHERE A IS NOT NULL');
      if (data.length < 2) return [];
      const headers = data[0].map((h) => h.toLowerCase().trim());
      return data.slice(1).map((row) => {
        const obj: any = {};
        headers.forEach((h, i) => {
          obj[h] = row[i] || '';
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
      const data = await fetchSheetQuery(GIDS.EXTRAS, 'SELECT A, B WHERE A IS NOT NULL');
      if (data.length < 2) return [];
      const headers = data[0].map((h) => h.toLowerCase().trim());
      return data.slice(1).map((row) => {
        const obj: any = {};
        headers.forEach((h, i) => {
          obj[h] = row[i] || '';
        });
        return obj as ExtraItem;
      });
    })();
  }
  return extrasCache;
}

export async function getSheetTOS(): Promise<TOSItem[]> {
  if (!tosCache) {
    tosCache = (async () => {
      // Usamos la URL de exportación directa (la que no falla con celdas vacías)
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GIDS.TOS}&t=${new Date().getTime()}`;

      try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) return [];
        const text = await response.text();
        const data = parseCSV(text);

        if (data.length < 2) return [];

        return (
          data
            .slice(1)
            .map((row) => ({
              type: row[0] || 'I',
              order: row[1] || '', // Lo dejamos como string por ahora
              title: row[2] || '',
              content: row[3] || '',
              update_date: row[4] || '',
            }))
            // Filtramos solo las que tienen contenido real para no renderizar filas vacías
            .filter((item) => item.title || item.content)
            // Ordenamos solo si 'order' tiene un número
            .sort((a, b) => {
              const valA = parseInt(a.order) || 999;
              const valB = parseInt(b.order) || 999;
              return valA - valB;
            })
        );
      } catch (e) {
        console.error('Error cargando TOS:', e);
        return [];
      }
    })();
  }
  return tosCache;
}

export function getSheetYCH(): Promise<YCHPiece[]> {
  if (!ychCache) {
    ychCache = (async () => {
      const data = await fetchSheetQuery(GIDS.YCH, 'SELECT A, B, C, D, E, F WHERE A IS NOT NULL');
      if (data.length < 2) return [];
      const headers = data[0].map((h) => h.toLowerCase().trim());
      return data
        .slice(1)
        .map((row) => {
          const obj: any = {};
          headers.forEach((h, i) => {
            obj[h] = row[i] || '';
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
      const data = await fetchSheetQuery(GIDS.GUIDELINES, 'SELECT A, B WHERE A IS NOT NULL');
      if (data.length < 2) return [];
      const headers = data[0].map((h) => h.toLowerCase().trim());
      return data.slice(1).map((row) => {
        const obj: any = {};
        headers.forEach((h, i) => {
          obj[h] = row[i] || '';
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
      const data = await fetchSheetQuery(GIDS.CALCULATOR, 'SELECT A, B, C, D WHERE A IS NOT NULL');
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

export async function getDiscountConfig(): Promise<DiscountConfig> {
  try {
    // Pedimos solo las columnas de control del evento para máxima velocidad
    const data = await fetchSheetQuery(GIDS.CALCULATOR, 'SELECT E, F, M LIMIT 1 OFFSET 0');

    if (data.length > 1) {
      const row = data[1];
      const jsValidNumber = row[1]?.replace(',', '.').replace('%', '') || '0';

      return {
        isActive: row[0]?.toUpperCase() === 'SI',
        percentage: parseFloat(jsValidNumber) || 0,
        endDate: row[2] || '',
      };
    }
  } catch (error) {
    console.error('Error fetching discount config:', error);
  }

  return { isActive: false, percentage: 0, endDate: '' };
}
