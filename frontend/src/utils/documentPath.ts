/** Utilidades para presentar ruta + nombre como un único campo en frontend. */
export function joinDocumentPath(ruta?: string | null, nombre?: string | null): string {
  if (!ruta) return nombre ?? '';
  if (!nombre) return ruta;
  const separator = ruta.includes('\\') ? '\\' : '/';
  return `${ruta.replace(/[\\/]$/, '')}${separator}${nombre}`;
}

export function splitDocumentPath(fichero: string): { ruta: string; nombre: string } {
  const normalized = fichero.trim();
  const slash = Math.max(normalized.lastIndexOf('/'), normalized.lastIndexOf('\\'));
  if (slash < 0) return { ruta: '', nombre: normalized };
  return {
    ruta: normalized.slice(0, slash),
    nombre: normalized.slice(slash + 1),
  };
}
