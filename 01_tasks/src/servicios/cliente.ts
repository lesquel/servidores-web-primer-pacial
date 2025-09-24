import type { ICliente } from "../domain/cliente";

const clientesDb: ICliente[] = [];

export class CrudClientes {
  crear(data: ICliente): ICliente {
    if (clientesDb.some((c) => c.id === data.id)) {
      throw new Error(`Cliente con id ${data.id} ya existe`);
    }
    clientesDb.push({ ...data });
    return data;
  }

  actualizar(id: number, cambios: Partial<ICliente>): ICliente | undefined {
    const idx = clientesDb.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    const current = clientesDb[idx]!;
    const updated: ICliente = { ...current, ...cambios, id: current.id };
    clientesDb[idx] = updated;
    return updated;
  }

  eliminar(id: number): boolean {
    const idx = clientesDb.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    clientesDb.splice(idx, 1);
    return true;
  }

  buscarPorId(id: number): ICliente | undefined {
    return clientesDb.find((c) => c.id === id);
  }

  listar(): ICliente[] {
    return [...clientesDb];
  }
}
