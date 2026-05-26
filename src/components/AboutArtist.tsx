import { useState } from 'react';

const AVATAR_URL = '/avatar.jpg';

const ABOUT_TABS = [
  {
    id: 'the-artist',
    label: 'The Wolfox',
    title: 'A Weird but Unique Blend',
    content: (
      <>
        <p className="mb-4">Hi! I'm Tarquitet, and yes, the character you see here is my personal avatar: a Wolfox.</p>
        <p>
          My art style isn't strictly one thing. I love to mix the expressiveness of anime, the proportions of realism,
          and the exaggerated fun of cartoons. The result is that slightly "weird" but entirely unique aesthetic you see
          in my gallery. I don't just draw characters; I try to give them a distinct, vibrant personality.
        </p>
      </>
    ),
  },
  {
    id: 'the-engineer',
    label: 'Multimedia Engineer',
    title: 'Design meets Code',
    content: (
      <>
        <p className="mb-4">
          Beyond the artwork, my actual profession is a Multimedia Engineer. At heart, I am both a designer and a
          programmer.
        </p>
        <p>
          While I didn't code this website from absolute scratch, I assembled, designed, and programmed this entire
          digital ecosystem using modern web technologies. I love blending the visual world with logical code!
        </p>
      </>
    ),
  },
];

export default function AboutArtist() {
  const [activeTab, setActiveTab] = useState(ABOUT_TABS[0].id);

  const activeContent = ABOUT_TABS.find((t) => t.id === activeTab);

  return (
    // LA SOLUCIÓN ESTÁ AQUÍ: pt-16 (espacio arriba) y pb-28 md:pb-36 (ESPACIO MASIVO ABAJO)
    <section className="w-full max-w-5xl mx-auto md:pb-36 px-4 md:px-8 relative z-10">
      {/* CAMBIO CLAVE: items-center centra el texto con la imagen, matando el espacio raro */}
      <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
        {/* AVATAR */}
        <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 relative group mx-auto md:mx-0">
          <div className="absolute inset-0 bg-brand-red rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-500"></div>
          <div className="relative w-full h-full aspect-square rounded-full border border-brand-red/20 overflow-hidden bg-[#050000] z-10">
            <img
              src={AVATAR_URL}
              alt="Tarquitet Wolfox Avatar"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        {/* CONTENIDO INTERACTIVO */}
        <div className="flex-1 w-full flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-4">
            Behind the <span className="text-brand-red">Screen</span>
          </h2>

          {/* BOTONES */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-4 justify-center md:justify-start w-full">
            {ABOUT_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs md:text-sm font-bold uppercase tracking-widest rounded-md transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-brand-red/10 text-brand-red border border-brand-red/30'
                    : 'text-brand-light/50 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ÁREA DE TEXTO */}
          <div className="min-h-[160px] w-full animate-in fade-in slide-in-from-bottom-2 duration-500" key={activeTab}>
            <h3 className="text-xl text-white font-bold italic mb-4">{activeContent?.title}</h3>
            <div className="text-brand-light/70 text-sm md:text-base leading-relaxed space-y-3">
              {activeContent?.content}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
