import { useEffect } from 'react';

interface PeticionSummary {
  id: number;
  asunto: string;
}

interface Args {
  isNew: boolean;
  peticionId?: number | null;
  peticiones: PeticionSummary[];
  descripcion?: string | null;
  setDescripcion: (value: string) => void;
}

/**
 * En una imputación nueva, al elegir petición propone su asunto como descripción.
 * No pisa una descripción que el usuario ya haya escrito ni afecta a ediciones.
 */
export function useImputacionCreateDefaults({
  isNew,
  peticionId,
  peticiones,
  descripcion,
  setDescripcion,
}: Args) {
  useEffect(() => {
    if (!isNew || !peticionId || (descripcion ?? '').trim()) return;
    const peticion = peticiones.find((item) => item.id === peticionId);
    if (peticion?.asunto) {
      setDescripcion(peticion.asunto);
    }
  }, [descripcion, isNew, peticionId, peticiones, setDescripcion]);
}
