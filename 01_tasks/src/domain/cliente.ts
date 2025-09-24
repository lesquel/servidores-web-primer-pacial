import type mascota = require("./mascota");

export interface ICliente {
  id: number;
  nommbre: string;
  edad: number;
  macotas: mascota.IMacota;
}
