import type { IMacota } from "../domain/mascota";

const mascotasDb: IMacota[] = [];

export class CrudMascotas {
  crear(data: IMacota): IMacota {
    if (mascotasDb.some((m) => m.id === data.id)) {
      throw new Error(`Mascota con id ${data.id} ya existe`);
    }
    mascotasDb.push({ ...data });
    return data;
  }

  actualizar(id: number, cambios: Partial<IMacota>): IMacota | undefined {
    const idx = mascotasDb.findIndex((m) => m.id === id);
    if (idx === -1) return undefined;
    const current = mascotasDb[idx]!;
    const updated: IMacota = { ...current, ...cambios, id: current.id };
    mascotasDb[idx] = updated;
    return updated;
  }

  eliminar(id: number): boolean {
    const idx = mascotasDb.findIndex((m) => m.id === id);
    if (idx === -1) return false;
    mascotasDb.splice(idx, 1);
    return true;
  }

  buscarPorId(id: number): IMacota | undefined {
    return mascotasDb.find((m) => m.id === id);
  }

  listar(): IMacota[] {
    return [...mascotasDb];
  }
}
