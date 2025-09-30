import type { IReserva } from "../domain/reserva";

const reservasDb: IReserva[] = [];

export class CrudReservas {
  crear(data: IReserva): IReserva {
    if (reservasDb.some((r) => r.id === data.id)) {
      throw new Error(`Reserva con id ${data.id} ya existe`);
    }
    reservasDb.push({ ...data });
    return data;
  }

  actualizar(id: number, cambios: Partial<IReserva>): IReserva | undefined {
    const idx = reservasDb.findIndex((r) => r.id === id);
    if (idx === -1) return undefined;
    const current = reservasDb[idx]!;
    const updated: IReserva = { ...current, ...cambios, id: current.id };
    reservasDb[idx] = updated;
    return updated;
  }

  eliminar(id: number): boolean {
    const idx = reservasDb.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    reservasDb.splice(idx, 1);
    return true;
  }

  buscarPorId(id: number): IReserva | undefined {
    return reservasDb.find((r) => r.id === id);
  }

  listar(): IReserva[] {
    return [...reservasDb];
  }
}
