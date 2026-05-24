const CACHE_NAME = 'tarquitet-disk-cache-v1';

// Pequeño registro para no duplicar peticiones SIMULTÁNEAS a internet
const inFlightRequests = new Map<string, Promise<string>>();

// NUEVO: Caché en Memoria RAM (Global para toda la web)
// Si una imagen ya se procesó, compartimos exactamente el mismo Blob a todos los componentes
const blobCache = new Map<string, string>();

export const getCachedImage = (url: string): Promise<string> => {
  if (!url) return Promise.resolve('');

  // 1. MAGIA: Si ya tenemos el Blob en memoria RAM, lo devolvemos INMEDIATAMENTE
  // Esto hace que el Portafolio y los Precios carguen al instante si el Hero ya las mostró.
  if (blobCache.has(url)) {
    return Promise.resolve(blobCache.get(url)!);
  }

  // 2. Si alguien está descargando esta imagen justo ahora, nos unimos a la espera
  if (inFlightRequests.has(url)) {
    return inFlightRequests.get(url)!;
  }

  const processImage = async () => {
    try {
      // 3. Abrimos el DISCO DURO del navegador
      const cache = await caches.open(CACHE_NAME);
      let response = await cache.match(url);

      // 4. Si NO está en el disco, la descargamos de internet
      if (!response) {
        response = await fetch(url);
        if (response.ok) {
          // La guardamos en el disco duro para futuras visitas
          cache.put(url, response.clone());
        }
      }

      // 5. Creamos el enlace temporal local
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // 6. LO GUARDAMOS EN RAM para que el resto de la página lo comparta instantáneamente
      blobCache.set(url, blobUrl);

      return blobUrl;
    } catch (error) {
      console.warn('Fallo al usar disco, usando URL original:', url);
      return url;
    } finally {
      inFlightRequests.delete(url); // Limpiamos el registro de peticiones
    }
  };

  const promise = processImage();
  inFlightRequests.set(url, promise);
  return promise;
};
