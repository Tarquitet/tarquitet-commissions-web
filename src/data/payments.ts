// src/data/payments.ts

export interface PaymentMethod {
  name: string;
  icon: string;
  url: string;
  isLocal: boolean;
}

export const paymentMethods: PaymentMethod[] = [
  { name: 'Nequi', icon: '/nequi.png', url: '#', isLocal: true },
  { name: 'PayPal', icon: '/paypal.png', url: 'https://www.paypal.me/tarquitetofficial', isLocal: false },
  { name: 'Patreon', icon: '/patreon.png', url: 'https://patreon.com/tarquitet', isLocal: false },
  { name: 'Ko-fi', icon: '/ko-fi.png', url: 'https://ko-fi.com/tarquitet', isLocal: false },
  { name: 'Global66', icon: '/global66.jpg', url: '#', isLocal: false },
  { name: 'StreamElements', icon: '/streamelements.jpg', url: '#', isLocal: false },
];
