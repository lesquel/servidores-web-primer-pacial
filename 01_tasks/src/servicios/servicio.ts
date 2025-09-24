import type { IServicio } from "../domain/servicio";

const serviciosDb: IServicio[] = [];

export class CrudServicios {
  crear(data: IServicio): IServicio {
    if (serviciosDb.some((s) => s.id === data.id)) {
      throw new Error(`Servicio con id ${data.id} ya existe`);
    }
    serviciosDb.push({ ...data });
    return data;
  }

  actualizar(id: number, cambios: Partial<IServicio>): IServicio | undefined {
    const idx = serviciosDb.findIndex((s) => s.id === id);
    if (idx === -1) return undefined;
    const current = serviciosDb[idx]!;
    const updated: IServicio = {
      id: current.id,
      nombre: cambios.nombre ?? current.nombre,
      precio: cambios.precio ?? current.precio,
    };
    serviciosDb[idx] = updated;
    return updated;
  }

  eliminar(id: number): boolean {
    const idx = serviciosDb.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    serviciosDb.splice(idx, 1);
    return true;
  }

  buscarPorId(id: number): IServicio | undefined {
    return serviciosDb.find((s) => s.id === id);
  }

  listar(): IServicio[] {
    return [...serviciosDb];
  }
}
