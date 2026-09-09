import { content } from '../data/content';

export default function AboutArtist() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
        {/* CONTENIDO */}
        <div className="flex-1 w-full space-y-8 text-center md:text-left">
          {/* Sección 1: El Artista */}
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-brand-red uppercase italic mb-3">
              {content.sections.about.artistTitle}
            </h3>
            {content.sections.about.artistContent.map((paragraph, idx) => (
              <p key={idx} className="mb-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Sección 2: El Proceso */}
          <div className="border-t pt-6" style={{ borderColor: 'var(--card-border)' }}>
            <h3 className="text-2xl md:text-3xl font-black text-brand-red uppercase italic mb-3">
              {content.sections.about.processTitle}
            </h3>
            {content.sections.about.processContent.map((paragraph, idx) => (
              <p key={idx} className="mb-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Sección 3: El Ingeniero */}
          <div className="border-t pt-6" style={{ borderColor: 'var(--card-border)' }}>
            <h3 className="text-2xl md:text-3xl font-black text-brand-red uppercase italic mb-3">
              {content.sections.about.engineerTitle}
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {content.sections.about.engineerContent}
            </p>

            {/* ENLACE A PROYECTOS PROFESIONALES */}
            <a
              href={content.sections.about.engineerLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-red hover:text-brand-darkred hover:underline transition-all duration-300 group"
            >
              {content.sections.about.engineerLink.text}
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
