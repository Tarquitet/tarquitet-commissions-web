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
      'To make your payment through Nequi, please contact me directly through my social networks or email. I will provide you with the exact details for the transfer or deposit securely.',
  },
  { name: 'PayPal', icon: '/paypal.png', url: 'https://www.paypal.me/tarquitetofficial', isLocal: false },
  { name: 'Ko-fi', icon: '/ko-fi.png', url: 'https://ko-fi.com/tarquitet', isLocal: false },
  {
    name: 'Global66',
    icon: '/global66.jpg',
    url: '#',
    isLocal: false,
    message:
      'I accept international transfers via Global66. Contact me by DM and I will provide you with the email and exact details of my account so you can make the transfer.',
  },
];
