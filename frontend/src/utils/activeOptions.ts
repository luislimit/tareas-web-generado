export interface ActivableEntity {
  id: number;
  activo: boolean;
}

/**
 * Opciones disponibles al crear/editar relaciones funcionales.
 * Las entidades inactivas nunca deben ofrecerse como nuevas selecciones.
 */
export function onlyActive<T extends ActivableEntity>(items: T[] | undefined): T[] {
  return (items ?? []).filter((item) => item.activo);
}

/**
 * En filtros de consulta sí deben aparecer activos e inactivos.
 */
export function allForFilter<T>(items: T[] | undefined): T[] {
  return items ?? [];
}

/**
 * Permite conservar una referencia histórica inactiva al editar un registro,
 * sin ofrecer el resto de inactivos como nuevas opciones.
 */
export function activePlusCurrent<T extends ActivableEntity>(
  items: T[] | undefined,
  currentId?: number | null,
): T[] {
  const source = items ?? [];
  return source.filter((item) => item.activo || item.id === currentId);
}
