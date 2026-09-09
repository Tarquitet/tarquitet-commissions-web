import { sections } from '../data/sections';
import { contentES, contentEN } from '../data/content';

export default function NavTitles({ activeSection, currentLang }: { activeSection: string; currentLang: 'es' | 'en' }) {
  const content = currentLang === 'en' ? contentEN : contentES;

  const currentIndex = sections.findIndex((s) => s.id === activeSection);
  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;
  const currentSection = sections[currentIndex];

  const getHref = (sectionId: string) => {
    const base = currentLang === 'en' ? `/en/${sectionId}` : `/${sectionId}`;
    return base;
  };

  return (
    <div className="flex items-center justify-center gap-8 md:gap-16 mb-12 w-full overflow-hidden px-4 pt-8">
      {prevSection ? (
        <a
          href={getHref(prevSection.id)}
          className="text-xl md:text-2xl font-black uppercase tracking-tighter text-text/20 hover:text-text/40 transition-all duration-300 border-b-4 border-text/20"
        >
          {content.sections[prevSection.id].title}
        </a>
      ) : (
        <div className="w-32 md:w-48" />
      )}

      {currentSection && (
        <div className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-brand-red border-b-4 border-brand-red cursor-default">
          {content.sections[currentSection.id].title}
        </div>
      )}

      {nextSection ? (
        <a
          href={getHref(nextSection.id)}
          className="text-xl md:text-2xl font-black uppercase tracking-tighter text-text/20 hover:text-text/40 transition-all duration-300 border-b-4 border-text/20"
        >
          {content.sections[nextSection.id].title}
        </a>
      ) : (
        <div className="w-32 md:w-48" />
      )}
    </div>
  );
}
