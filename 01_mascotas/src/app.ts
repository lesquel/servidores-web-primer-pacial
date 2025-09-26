import { CrudServicios } from "./servicios/servicio";
import { CrudClientes } from "./servicios/cliente";
import { CrudMascotas } from "./servicios/mascota";
import { CrudReservas } from "./servicios/reserva";

// Pequeño ejemplo de uso en memoria
const servicioSrv = new CrudServicios();
const clienteSrv = new CrudClientes();
const mascotaSrv = new CrudMascotas();
const reservaSrv = new CrudReservas();

// Crear Servicios
servicioSrv.crear({ id: 1, nombre: "Baño", precio: 10 });
servicioSrv.crear({ id: 2, nombre: "Corte", precio: 15 });

// Crear Cliente
const cliente = clienteSrv.crear({
  id: 1,
  nommbre: "Ana",
  edad: 30,
  macotas: undefined as any,
});

// Crear Mascota ligada al cliente
const mascota = mascotaSrv.crear({ id: 1, nombre: "Firulais", cliente });

// Relacionar cliente->mascota simple (según interfaz ICliente)
clienteSrv.actualizar(cliente.id, { macotas: mascota });

// Crear Reserva con cliente, mascota y servicios
reservaSrv.crear({
  id: 1,
  fecha: new Date().toISOString(),
  cliente,
  mascota: [mascota],
  servicios: servicioSrv.listar(),
});

console.log("Servicios:", servicioSrv.listar());
console.log("Clientes:", clienteSrv.listar());
console.log("Mascotas:", mascotaSrv.listar());
console.log("Reservas:", reservaSrv.listar());
