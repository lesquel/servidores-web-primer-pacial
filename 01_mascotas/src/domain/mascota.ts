import type cliente = require("./cliente");

export interface IMacota {
  id: number;
  nombre: string;
  cliente: cliente.ICliente;
}
