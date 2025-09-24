import type cliente = require("./cliente");
import type mascota = require("./mascota");
import type servicio = require("./servicio");

export interface IReserva {
  id: number;
  fecha: string;
  cliente: cliente.ICliente;
  mascota: mascota.IMacota[];
  servicios: servicio.IServicio[];
}
