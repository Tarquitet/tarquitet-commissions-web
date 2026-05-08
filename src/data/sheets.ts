export interface ArtPiece {
  title: string;
  filename: string;
  category: string;
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

const ART_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQlmh6ewrKoqQ_H35C-6QRHrI5OdzfA8ZDrZZohRxGr-m0NP-1300tvufqQeu3sKfAKQRQR68F_-_l4/pub?gid=0&single=true&output=csv';
const PRICING_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQlmh6ewrKoqQ_H35C-6QRHrI5OdzfA8ZDrZZohRxGr-m0NP-1300tvufqQeu3sKfAKQRQR68F_-_l4/pub?gid=835010888&single=true&output=csv';
const EXTRAS_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQlmh6ewrKoqQ_H35C-6QRHrI5OdzfA8ZDrZZohRxGr-m0NP-1300tvufqQeu3sKfAKQRQR68F_-_l4/pub?gid=1100543912&single=true&output=csv';
const TOS_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQlmh6ewrKoqQ_H35C-6QRHrI5OdzfA8ZDrZZohRxGr-m0NP-1300tvufqQeu3sKfAKQRQR68F_-_l4/pub?gid=299036177&single=true&output=csv';

// ============================================================================
// MOTOR DE LECTURA CSV (Soporta comas y saltos de línea dentro de las celdas)
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
        // Comillas dobles escapadas dentro del texto ("")
        current += '"';
        i++;
      } else {
        // Entrar o salir de las comillas
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Fin de la celda (columna)
      row.push(current.trim());
      current = '';
    } else if (char === '\n' && !inQuotes) {
      // Fin de la fila
      row.push(current.trim());
      if (row.some((cell) => cell !== '')) result.push(row);
      row = [];
      current = '';
    } else if (char === '\r' && !inQuotes) {
      // Ignorar retornos de carro fuera de comillas
    } else {
      current += char;
    }
  }

  // Añadir la última celda/fila si quedó pendiente
  if (current !== '' || row.length > 0) {
    row.push(current.trim());
    if (row.some((cell) => cell !== '')) result.push(row);
  }

  return result;
}

// ============================================================================
// FETCHERS DE DATOS
// ============================================================================

export async function getSheetArtworks(): Promise<ArtPiece[]> {
  try {
    const response = await fetch(ART_SHEET_URL);
    if (!response.ok) return [];
    const data = parseCSV(await response.text());
    if (data.length < 2) return [];

    const headers = data[0];
    return data
      .slice(1)
      .map((row) => {
        const obj: any = {};
        headers.forEach((h, i) => {
          obj[h] = row[i] || '';
        });
        return obj as ArtPiece;
      })
      .filter((item) => item.title && item.date && item.filename)
      .sort((a, b) => parseInt(b.date) - parseInt(a.date));
  } catch (e) {
    return [];
  }
}

export async function getSheetPrices(): Promise<PricingTier[]> {
  try {
    const response = await fetch(PRICING_SHEET_URL);
    if (!response.ok) return [];
    const data = parseCSV(await response.text());
    if (data.length < 2) return [];

    const headers = data[0];
    return data.slice(1).map((row) => {
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h] = row[i] || '';
      });
      return obj as PricingTier;
    });
  } catch (e) {
    return [];
  }
}

export async function getSheetExtras(): Promise<ExtraItem[]> {
  try {
    const response = await fetch(EXTRAS_SHEET_URL);
    if (!response.ok) return [];
    const data = parseCSV(await response.text());
    if (data.length < 2) return [];

    const headers = data[0];
    return data.slice(1).map((row) => {
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h] = row[i] || '';
      });
      return obj as ExtraItem;
    });
  } catch (e) {
    return [];
  }
}

export async function getSheetTOS(): Promise<TOSItem[]> {
  try {
    const response = await fetch(TOS_SHEET_URL);
    if (!response.ok) return [];
    const data = parseCSV(await response.text());
    if (data.length < 2) return [];

    const headers = data[0];
    return data
      .slice(1)
      .map((row) => {
        const obj: any = {};
        headers.forEach((h, i) => {
          obj[h] = row[i] || '';
        });
        if (!obj.type) obj.type = 'I';
        return obj as TOSItem;
      })
      .sort((a, b) => parseInt(a.order || '0') - parseInt(b.order || '0'));
  } catch (e) {
    return [];
  }
}
