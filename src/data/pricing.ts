export interface PricingItem {
  category: string;
  price: string;
  description: string;
  features: string[];
}

export const commissionPrices: PricingItem[] = [
  {
    category: 'Retrato / Cabeza',
    price: '$25+',
    description: 'Vista detallada del busto. Enfocado en expresiones y detalles faciales.',
    features: ['Totalmente Coloreado', 'Fondo Simple', 'PNG de Alta Resolución'],
  },
  {
    category: 'Medio Cuerpo',
    price: '$45+',
    description: 'Desde la cabeza hasta las caderas. Ideal para tomas de personajes con detalle medio.',
    features: ['Totalmente Coloreado', 'Accesorios incluidos', 'PNG de Alta Resolución'],
  },
  {
    category: 'Cuerpo Completo',
    price: '$75+',
    description: 'Diseño completo del personaje. Rango completo de acción o pose estática.',
    features: ['Totalmente Coloreado', 'Equipo Complejo', 'PNG de Alta Resolución', 'Versión Transparente'],
  },
];
