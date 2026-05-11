const CACHE_NAME = 'tarquitet-disk-cache-v1';

// Pequeño registro en memoria solo para no duplicar peticiones SIEMULTÁNEAS
const inFlightRequests = new Map<string, Promise<string>>();

export const getCachedImage = (url: string): Promise<string> => {
  if (!url) return Promise.resolve('');

  // 1. Si alguien está descargando esta imagen justo ahora, nos unimos a la espera
  if (inFlightRequests.has(url)) {
    return inFlightRequests.get(url)!;
  }

  const processImage = async () => {
    try {
      // 2. Abrimos el DISCO DURO del navegador
      const cache = await caches.open(CACHE_NAME);
      let response = await cache.match(url);

      // 3. Si NO está en el disco, la descargamos de internet
      if (!response) {
        response = await fetch(url);
        if (response.ok) {
          // La guardamos en el disco duro para futuras visitas
          cache.put(url, response.clone());
        }
      }

      // 4. Creamos un enlace temporal local solo para mostrarla en el HTML
      const blob = await response.blob();
      return URL.createObjectURL(blob);
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
