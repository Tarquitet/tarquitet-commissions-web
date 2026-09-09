export interface SiteContent {
  hero: {
    greeting: string;
    name: string;
    subtitle: string;
    ctaButton: string;
  };
  sections: {
    about: {
      title: string;
      artistTitle: string;
      artistContent: string[];
      processTitle: string;
      processContent: string[];
      engineerTitle: string;
      engineerContent: string;
      engineerLink: {
        text: string;
        url: string;
      };
    };
    commissions: {
      title: string;
      customButton: string;
      ychButton: string;
      ychPlaceholder: string;
      loadingText: string;
      modal: {
        versionsTitle: string;
        whatIncludes: string;
        requestButton: string;
        noFeatures: string;
        ctaMessage: string;
      };
    };
    scope: {
      title: string;
      iAccept: string;
      iDontAccept: string;
      variableNote: string;
    };
    tos: {
      title: string;
      loadingText: string;
      latestUpdate: string;
      backgroundText: string;
    };
    contact: {
      title: string;
      deliveryTime: string;
      discordLabel: string;
      emailLabel: string;
      networksLabel: string;
      copiedText: string;
      formButtonText: string;
      contactDetails: {
        discordUsername: string;
        emailAddress: string;
        formUrl: string;
      };
    };
  };
}

// ============================================================================
// 1. DICCIONARIO EN ESPAÑOL
// ============================================================================
export const contentES: SiteContent = {
  hero: {
    greeting: '¡Hola! Soy',
    name: 'Tarquitet',
    subtitle:
      'Ilustrador digital que combina estilos de dibujo como anime, realismo y cartoon para que tu dibujo sea la diferencia.',
    ctaButton: 'Ver más ↓',
  },
  sections: {
    about: {
      title: 'Sobre Mí',
      artistTitle: 'The Wolfox',
      artistContent: [
        '¡Hola! Soy Tarquitet, y el personaje que me representa es mi avatar personal: un Wolfox.',
        'Mi estilo de arte es un híbrido muy específico. La estructura central, el entintado y las expresiones faciales se basan fuertemente en la estética del anime, pero la forma en que aplico luces, sombras y realces empuja el resultado final a un territorio semirrealista.',
        'Aunque mis sujetos son mayormente personajes antropomórficos, mi objetivo nunca es dejarlos planos. Busco darles solidez usando técnicas de renderizado y volumen 3D creíble.',
      ],
      processTitle: 'Mi Proceso',
      processContent: [
        'Mi flujo de trabajo es muy adaptable. Dependiendo de la pieza, puedo usar colores planos nítidos, cel-shading afilado, o llevarlo hasta ese sombreado suave semirrealista para construir volúmenes profundos.',
        'Cada ilustración es 100% dibujada a mano desde un lienzo en blanco. Para dar solidez a mis proporciones estilo anime, estudio y me baso activamente en referencias de la vida real para poses dinámicas e iluminación compleja.',
      ],
      engineerTitle: 'Ingeniero Multimedia',
      engineerContent:
        'Más allá del lienzo digital, mi formación formal es en Ingeniería Multimedia. En el fondo, equilibro ambos mundos: soy diseñador y programador. Prospero en la intersección de la creatividad visual y la lógica del código.',
      engineerLink: {
        text: 'Revisa mis proyectos profesionales →',
        url: 'https://tarquitet.com',
      },
    },
    commissions: {
      title: 'Comisiones',
      customButton: 'Comisiones Personalizadas',
      ychButton: 'YCH / Poses',
      ychPlaceholder: 'Sección YCH en desarrollo. Aquí se mostrarán las poses pre-hechas disponibles.',
      loadingText: '// Cargando portafolio...',
      modal: {
        versionsTitle: 'Versiones disponibles:',
        whatIncludes: '¿Qué incluye?',
        requestButton: 'Solicitar esta comisión',
        noFeatures: 'Detalles estándar',
        ctaMessage: 'Si te interesa este estilo, puedes solicitar tu comisión directamente en la sección de Contacto.',
      },
    },
    scope: {
      title: 'Alcance',
      iAccept: 'Sí Acepto',
      iDontAccept: 'No Acepto',
      variableNote:
        '* Nota: Estas directrices pueden variar con el tiempo según la complejidad del proyecto o nuevas experiencias.',
    },
    tos: {
      title: 'Términos',
      loadingText: '// Cargando términos legales...',
      latestUpdate: 'ÚLTIMA ACTUALIZACIÓN',
      backgroundText: 'Términos de Servicio',
    },
    contact: {
      title: 'Contacto',
      deliveryTime:
        'La respuesta y el progreso del trabajo dependen de la complejidad del proyecto y mi tiempo disponible.\nElige el medio que prefieras para comunicarte.',
      discordLabel: 'Discord',
      emailLabel: 'Correo',
      networksLabel: 'O encuéntrame en',
      copiedText: '¡Copiado!',
      formButtonText: 'Enviar solicitud vía formulario →',
      contactDetails: {
        discordUsername: 'tarquitet',
        emailAddress: 'contact@tarquitet.com',
        formUrl: 'https://forms.gle/QLrFdUaHsva3t8Dg8',
      },
    },
  },
};

// ============================================================================
// 2. DICCIONARIO EN INGLÉS
// ============================================================================
export const contentEN: SiteContent = {
  hero: {
    greeting: "Hi! I'm",
    name: 'Tarquitet',
    subtitle:
      'Digital illustrator who combines styles of drawing like anime, realism and cartoon so your drawing stands out.',
    ctaButton: 'See more ↓',
  },
  sections: {
    about: {
      title: 'About',
      artistTitle: 'The Wolfox',
      artistContent: [
        "Hi! I'm Tarquitet, and the character representing me is my personal avatar: a Wolfox.",
        'My art style is a very specific hybrid. The core structure, linework, and facial expressions draw heavily from anime aesthetics, but the way I apply light, shadows, and highlights pushes the final result into a semi-realistic territory.',
        'While my subjects are mostly anthropomorphic characters, my goal is never to leave them flat. I aim to ground them using believable 3D volume and rendering techniques.',
      ],
      processTitle: 'My Process',
      processContent: [
        'My workflow is highly adaptable. Depending on the piece, I might use crisp flat colors, sharp cel-shading, or push all the way into that semi-realistic soft shading to build deep volumes.',
        'Every illustration is 100% hand-drawn from a blank canvas. To ground my stylized anime proportions, I actively study and rely on real-life references for dynamic poses and complex lighting.',
      ],
      engineerTitle: 'Multimedia Engineer',
      engineerContent:
        'Beyond the digital canvas, my formal background is in Multimedia Engineering. At heart, I balance both worlds: I am a designer and a programmer. I thrive at the intersection of visual creativity and logical code.',
      engineerLink: {
        text: 'Check out my professional projects →',
        url: 'https://tarquitet.com',
      },
    },
    commissions: {
      title: 'Commissions',
      customButton: 'Custom Commissions',
      ychButton: 'YCH / Poses',
      ychPlaceholder: 'YCH section in development. Here will be shown the available pre-made poses.',
      loadingText: '// Loading portfolio...',
      modal: {
        versionsTitle: 'Available versions:',
        whatIncludes: 'What includes?',
        requestButton: 'Request this commission',
        noFeatures: 'Standard details',
        ctaMessage:
          'If you are interested in this style, you can request your commission directly in the Contact section.',
      },
    },
    scope: {
      title: 'Scope',
      iAccept: 'I Accept',
      iDontAccept: "I Don't Accept",
      variableNote:
        '* Note: These guidelines may vary over time depending on the complexity of the project or new experiences.',
    },
    tos: {
      title: 'Terms',
      loadingText: '// Loading legal terms...',
      latestUpdate: 'LATEST UPDATE',
      backgroundText: 'Terms of Service',
    },
    contact: {
      title: 'Contact',
      deliveryTime:
        'Response & work progress updates depends on the complexity of the project and my available time.\nChoose the medium you prefer for communication.',
      discordLabel: 'Discord',
      emailLabel: 'Email',
      networksLabel: 'Or find me on',
      copiedText: 'Copied!',
      formButtonText: 'Send request via form →',
      contactDetails: {
        discordUsername: 'tarquitet',
        emailAddress: 'contact@tarquitet.com',
        formUrl: 'https://forms.gle/QLrFdUaHsva3t8Dg8',
      },
    },
  },
};

// ============================================================================
// 3. EXPORTACIÓN SEGURA PARA REACT (EVITA EL ERROR SSR)
// ============================================================================
// En el servidor (Astro), 'window' no existe, así que usa Español por defecto.
// En el cliente (navegador), lee el localStorage para mantener la preferencia del usuario.
export const content: SiteContent =
  typeof window !== 'undefined' ? (localStorage.getItem('lang') === 'en' ? contentEN : contentES) : contentES;
