export type Rol = "admin" | "editor" | "visitante";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  activo: boolean;
}

export class UsuarioEntity {
  public readonly id: string;
  public nombre: string;
  public email: string;
  public rol: Rol;
  public activo: boolean;

  constructor(
    id: string,
    nombre: string,
    email: string,
    rol: Rol,
    activo: boolean = true
  ) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.rol = rol;
    this.activo = activo;

    this.validar();
  }

  private validar(): void {
    if (!this.id) {
      throw new Error("El ID del usuario es requerido");
    }

    if (!this.nombre || this.nombre.trim().length === 0) {
      throw new Error("El nombre del usuario es requerido");
    }

    if (!this.email || !this.validarEmail(this.email)) {
      throw new Error("El email del usuario debe ser válido");
    }

    if (!["admin", "editor", "visitante"].includes(this.rol)) {
      throw new Error("El rol debe ser admin, editor o visitante");
    }
  }

  private validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public actualizarNombre(nuevoNombre: string): void {
    if (!nuevoNombre || nuevoNombre.trim().length === 0) {
      throw new Error("El nombre no puede estar vacío");
    }
    this.nombre = nuevoNombre;
  }

  public actualizarEmail(nuevoEmail: string): void {
    if (!nuevoEmail || !this.validarEmail(nuevoEmail)) {
      throw new Error("El email debe ser válido");
    }
    this.email = nuevoEmail;
  }

  public actualizarRol(nuevoRol: Rol): void {
    if (!["admin", "editor", "visitante"].includes(nuevoRol)) {
      throw new Error("El rol debe ser admin, editor o visitante");
    }
    this.rol = nuevoRol;
  }

  public activar(): void {
    this.activo = true;
  }

  public desactivar(): void {
    this.activo = false;
  }

  public toJSON(): Usuario {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      rol: this.rol,
      activo: this.activo,
    };
  }
}
