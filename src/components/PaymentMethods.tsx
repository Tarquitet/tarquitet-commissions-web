import { useState } from 'react';
import { paymentMethods } from '../data/payments';
import GlobalModal from './GlobalModal';

export default function PaymentMethods() {
  const [modalData, setModalData] = useState({
    isOpen: false,
    title: '',
    message: '',
  });

  const handleOpenModal = (method: any) => {
    const finalMessage =
      method.message ||
      `To make your payment through ${method.name}, please contact me directly through my social networks or email. I will provide you with the exact details securely.`;

    setModalData({
      isOpen: true,
      title: `Payment via ${method.name}`,
      message: finalMessage,
    });
  };

  return (
    <section className="relative">
      <div className="flex flex-wrap justify-center gap-8 md:gap-16">
        {paymentMethods.map((method, i) => {
          const isLink = method.url && method.url !== '#';

          // Subcomponente visual del botón para no repetir código
          const PaymentIcon = () => (
            <>
              <div className="w-16 h-16 bg-[#050000] border border-brand-red/20 rounded-xl flex items-center justify-center p-3 group-hover:border-brand-red group-hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all duration-500">
                <img
                  src={method.icon}
                  alt={`Logo of ${method.name}`}
                  className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <span className="text-brand-light/50 font-mono text-[10px] uppercase tracking-widest group-hover:text-brand-red transition-colors border-b border-transparent group-hover:border-brand-red pb-1">
                {method.name}
              </span>
            </>
          );

          // 2. SEPARACIÓN CLARA: O ES UN ENLACE (<a>) O ES UN BOTÓN (<button>)
          return (
            <div key={i} className="flex flex-col items-center gap-4">
              {isLink ? (
                <a
                  href={method.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-4 cursor-pointer"
                >
                  <PaymentIcon />
                </a>
              ) : (
                <button
                  onClick={() => handleOpenModal(method)}
                  className="group flex flex-col items-center gap-4 cursor-pointer focus:outline-none"
                >
                  <PaymentIcon />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <GlobalModal
        isOpen={modalData.isOpen}
        onClose={() => setModalData({ ...modalData, isOpen: false })}
        title={modalData.title}
      >
        <p className="text-lg text-brand-light leading-relaxed">{modalData.message}</p>
      </GlobalModal>
    </section>
  );
}
