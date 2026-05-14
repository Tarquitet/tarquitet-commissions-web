// src/data/payments.ts

export interface PaymentMethod {
  name: string;
  icon: string;
  url: string;
  isLocal: boolean;
  message?: string;
  isWarning?: boolean;
  // --- DATOS DE COMISIÓN UNIFICADOS ---
  percentage: number;
  fixed: number;
}

export const paymentMethods: PaymentMethod[] = [
  {
    name: 'PayPal',
    icon: '/paypal.png',
    url: 'https://www.paypal.me/tarquitetofficial',
    isLocal: false,
    percentage: 0.0549, // 5.49%
    fixed: 0.3,
  },
  {
    name: 'Ko-fi',
    icon: '/ko-fi.png',
    url: 'https://ko-fi.com/tarquitet',
    isLocal: false,
    percentage: 0.0849, // 5% + fees de pasarela
    fixed: 0.49,
  },
  {
    name: 'Artistree',
    icon: '/artistree.svg',
    url: 'https://artistree.io/tarquitet',
    isLocal: false,
    percentage: 0.065, // Fee que Artistree cobra al cliente
    fixed: 0,
    isWarning: true,
    message:
      'Notice: By choosing Artistree, you will be redirected to their platform... an estimated 5-10% fee will be added.',
  },
  {
    name: 'Nequi',
    icon: '/nequi.png',
    url: '#',
    isLocal: true,
    percentage: 0, // Sin comisión automática
    fixed: 0,
    message: 'To make your payment through Nequi, please contact me directly...',
  },
  {
    name: 'Global66',
    icon: '/global66.jpg',
    url: '#',
    isLocal: false,
    percentage: 0,
    fixed: 0,
    message: 'I accept international transfers via Global66. Contact me by DM...',
  },
];
