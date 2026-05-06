export interface ArtPiece {
  title: string;
  filename: string;
  category: string;
  date: string; // <-- Nueva propiedad
}

export const myArt = [
  {
    title: 'Akiko (Pose)',
    filename: 'Akiko-pose.webp',
    category: 'Cuerpo Completo',
    date: '2024',
  },
  {
    title: 'Alika (Pose)',
    filename: 'Alika-pose.webp',
    category: 'Cuerpo Completo',
    date: '2024',
  },
  {
    title: 'Atila (Frente)',
    filename: 'Atila-frente.webp',
    category: 'Boceto',
    date: '2025',
  },
  {
    title: 'Atila (Risa)',
    filename: 'Atila-risa.webp',
    category: 'Boceto',
    date: '2025',
  },
].sort((a, b) => parseInt(b.date) - parseInt(a.date));
