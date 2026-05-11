// src/utils/formatters.ts

export function formatHumanTitle(titleFromSheet: string): string {
  if (!titleFromSheet) return 'No Data';

  // 1. Solo ponemos espacio si una minúscula va seguida de una mayúscula
  // Esto convierte "SimpleBG" en "Simple BG", pero deja "BG" intacto.
  let humanTitle = titleFromSheet.replace(/([a-z])([A-Z])/g, '$1 $2').trim();

  // 2. Separar números de letras (ej: "Zorro2024" -> "Zorro 2024")
  humanTitle = humanTitle.replace(/([a-zA-Z])(\d+)/g, '$1 $2');

  // 3. Diccionario de correcciones y siglas
  // Añadimos 'Bg' para que cuando el código lo pase a minúsculas y luego a título,
  // lo fuerce a ser 'BG' en mayúsculas.
  const corrections: Record<string, string> = {
    Prctice: 'Practice',
    Pretice: 'Practice',
    Hhalf: 'Half',
    Ssketch: 'Sketch',
    Lockx: 'Lockx',
    Bg: 'BG', // <--- Fix para las siglas
    Ych: 'YCH', // <--- Fix para YCH
  };

  // Aplicar formato de "Title Case" (Primera letra mayúscula)
  let formatted = humanTitle
    .toLowerCase()
    .split(' ')
    .filter((w) => w.length > 0)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  // 4. Aplicar correcciones finales sobre el texto ya formateado
  Object.keys(corrections).forEach((errorText) => {
    const regex = new RegExp(`\\b${errorText}\\b`, 'gi');
    formatted = formatted.replace(regex, corrections[errorText]);
  });

  return formatted;
}

export const preventActions = (e: React.SyntheticEvent) => {
  e.preventDefault();
  return false;
};

export const getImagePath = (filename: string) => {
  if (!filename) return '';

  // Si ya es un enlace externo (imgur, etc), lo dejamos tranquilo
  if (filename.startsWith('http')) return filename;

  // Tu enlace original de Google Drive
  const driveUrl = `https://drive.google.com/uc?export=view&id=${filename}`;

  // LA MAGIA: Envolvemos el enlace en el CDN
  // output=webp la hace ultra ligera
  // afil=true ayuda a los bordes de tus dibujos transparentes
  return `https://wsrv.nl/?url=${encodeURIComponent(driveUrl)}&output=webp&default=${encodeURIComponent(driveUrl)}`;
};
