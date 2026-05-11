// src/data/payments.ts

export interface PaymentMethod {
  name: string;
  icon: string;
  url: string;
  isLocal: boolean;
  message?: string;
}

export const paymentMethods: PaymentMethod[] = [
  {
    name: 'Nequi',
    icon: '/nequi.png',
    url: '#',
    isLocal: true,
    message:
      'Para realizar tu pago a través de Nequi, por favor contáctame directamente por mis redes sociales o correo. Te proporcionaré los datos exactos para la transferencia o depósito de forma segura.',
  },
  { name: 'PayPal', icon: '/paypal.png', url: 'https://www.paypal.me/tarquitetofficial', isLocal: false },
  { name: 'Patreon', icon: '/patreon.png', url: 'https://patreon.com/tarquitet', isLocal: false },
  { name: 'Ko-fi', icon: '/ko-fi.png', url: 'https://ko-fi.com/tarquitet', isLocal: false },
  {
    name: 'Global66',
    icon: '/global66.jpg',
    url: '#',
    isLocal: false,
    message:
      'Acepto transferencias internacionales vía Global66. Contáctame por DM y te proporcionaré el correo y los datos exactos de mi cuenta para que realices el envío.',
  },
  {
    name: 'StreamElements',
    icon: '/streamelements.jpg',
    url: 'https://streamelements.com/tarquitet/tip',
    isLocal: false,
  },
];
