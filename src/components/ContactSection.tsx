import { useState } from 'react';
import { artisticNetworks } from '../data/socials';
import { content } from '../data/content';
import type { SocialNetwork } from '../data/socials';

export default function ContactSection() {
  const [copied, setCopied] = useState<string | null>(null);

  const { contactDetails } = content.sections.contact;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  };

  const cardStyle = {
    backgroundColor: 'var(--card-bg)',
    borderColor: 'var(--card-border)',
  };

  return (
    <div className="text-center space-y-10 max-w-4xl mx-auto">
      <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
        {content.sections.contact.deliveryTime}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Discord */}
        <div
          className="group flex flex-col items-center gap-3 p-6 rounded-xl border-2 hover:border-brand-red hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          style={cardStyle}
        >
          <span className="text-xs font-black text-brand-red uppercase tracking-widest">
            {content.sections.contact.discordLabel}
          </span>
          <button
            onClick={() => handleCopy(contactDetails.discordUsername, 'discord')}
            className="text-2xl font-black italic uppercase group-hover:text-brand-red flex items-center gap-2 transition-colors duration-300"
          >
            @{contactDetails.discordUsername}
            {copied === 'discord' ? (
              <span className="text-brand-red text-xs font-bold">{content.sections.contact.copiedText}</span>
            ) : (
              <svg
                className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                ></path>
              </svg>
            )}
          </button>
        </div>

        {/* Email */}
        <div
          className="group flex flex-col items-center gap-3 p-6 rounded-xl border-2 hover:border-brand-red hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          style={cardStyle}
        >
          <span className="text-xs font-black text-brand-red uppercase tracking-widest">
            {content.sections.contact.emailLabel}
          </span>
          <button
            onClick={() => handleCopy(contactDetails.emailAddress, 'email')}
            className="text-xl font-black italic uppercase group-hover:text-brand-red flex items-center gap-2 transition-colors duration-300"
          >
            {contactDetails.emailAddress}
            {copied === 'email' ? (
              <span className="text-brand-red text-xs font-bold">{content.sections.contact.copiedText}</span>
            ) : (
              <svg
                className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                ></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Redes Sociales */}
      <div className="space-y-4">
        <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          {content.sections.contact.networksLabel}
        </span>
        <div className="flex flex-wrap justify-center gap-4">
          {artisticNetworks.map((network: SocialNetwork) => (
            <a
              key={network.name}
              href={network.url}
              target="_blank"
              rel="noopener noreferrer"
              title={network.name}
              className="group flex flex-col items-center gap-2 hover:-translate-y-1 transition-transform duration-300"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-brand-red transition-colors duration-300"
                style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
              >
                <div
                  className="w-6 h-6 group-hover:bg-beige transition-colors duration-300"
                  style={{
                    backgroundColor: 'var(--text-color)',
                    maskImage: `url(/icons/${network.icon})`,
                    WebkitMaskImage: `url(/icons/${network.icon})`,
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center',
                  }}
                />
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-wider group-hover:text-brand-red transition-colors duration-300"
                style={{ color: 'var(--text-muted)' }}
              >
                {network.name}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Botón del formulario */}
      <a
        href={contactDetails.formUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-10 py-4 bg-brand-red text-beige font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-brand-darkred hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
      >
        {content.sections.contact.formButtonText}
      </a>
    </div>
  );
}
