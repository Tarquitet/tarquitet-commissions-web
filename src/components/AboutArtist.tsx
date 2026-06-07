import { useState } from 'react';

const AVATAR_URL = '/avatar.jpg';

const ABOUT_TABS = [
  {
    id: 'the-artist',
    label: 'The Wolfox',
    title: 'A Blended Aesthetic',
    content: (
      <>
        <p className="mb-4">Hi! I'm Tarquitet, and the character representing me is my personal avatar: a Wolfox.</p>
        <p>
          My art style is a very specific hybrid. The core structure, linework, and facial expressions draw heavily from{' '}
          <strong>anime aesthetics</strong>, but the way I apply light, shadows, and highlights pushes the final result
          into a <strong>semi-realistic</strong> territory.
        </p>
        <p className="mt-4">
          While my subjects are mostly anthropomorphic characters (which inherently brings a stylized or "cartoon"
          element), my goal is never to leave them flat. I aim to ground them using believable 3D volume and rendering
          techniques, giving these stylized characters a tangible, vibrant, and solid presence.
        </p>
      </>
    ),
  },
  {
    id: 'the-process',
    label: 'My Process',
    title: 'Versatility & Hand-Drawn Roots',
    content: (
      <>
        <p className="mb-4">
          My workflow is highly adaptable. Depending on the piece, I might use crisp <strong>flat colors</strong>, sharp{' '}
          <strong>cel-shading</strong>, or push all the way into that <strong>semi-realistic soft shading</strong> to
          build deep volumes. Because my rendering style shifts based on the character's needs, some have even wondered
          if my work is AI-generated.
        </p>
        <p>
          The truth is simply that I love experimenting. Every illustration is <strong>100% hand-drawn</strong> from a
          blank canvas. To ground my stylized anime proportions, I actively study and rely on{' '}
          <strong>real-life references</strong> for dynamic poses and complex lighting.
        </p>
        <p>
          I believe in total transparency: while I sometimes use AI tools strictly to brainstorm dynamic poses or
          generate specific lighting references to study, the actual artwork is <strong>100% hand-drawn</strong>. From
          the initial sketch on a blank canvas to the final painted brushstroke, there is no AI generation or tracing
          involved on the canvas itself. It's all about raw digital drafting, studying anatomy, and finding the perfect
          finish for each piece.
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
          Beyond the digital canvas, my formal background is in Multimedia Engineering. At heart, I balance both worlds:
          I am a designer and a programmer.
        </p>
        <p>
          While I didn't write every single line of this website from absolute scratch, I assembled, designed, and
          customized this entire portfolio ecosystem. I thrive at the intersection of visual creativity and logical
          code.
        </p>
      </>
    ),
  },
];

export default function AboutArtist() {
  const [activeTab, setActiveTab] = useState(ABOUT_TABS[0].id);

  const activeContent = ABOUT_TABS.find((t) => t.id === activeTab);

  return (
    <section className="w-full max-w-5xl mx-auto md:pb-36 px-4 md:px-8 relative z-10">
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
                    : 'text-brand-light/80 hover:text-white hover:bg-white/5 border border-transparent'
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
