// import { UserContainer } from "./user/shared/container";

// async function main() {
//   console.log("🚀 Sistema de Gestión de Usuarios");
//   console.log("==================================\n");

//   const container = UserContainer.getInstance();
//   const usuarioController = container.getUsuarioController();

//   try {
//     // 1. CREATE - Usando Callbacks
//     console.log("1. 📝 CREATE - Creando nuevo usuario (Callbacks)");
//     console.log("------------------------------------------------");

//     const nuevoUsuario = await usuarioController.crearUsuario({
//       nombre: "Laura Rodríguez",
//       email: "laura.rodriguez@example.com",
//       rol: "editor",
//     });

//     console.log("✅ Usuario creado:", nuevoUsuario);
//     console.log();

//     // 2. READ - Usando Async/Await
//     console.log("2. 📖 READ - Consultando usuarios (Async/Await)");
//     console.log("---------------------------------------------");

//     console.log("Usuarios activos:");
//     const usuariosActivos = await usuarioController.obtenerUsuariosActivos();
//     usuariosActivos.forEach((usuario, index) => {
//       console.log(
//         `${index + 1}. ${usuario.nombre} (${usuario.email}) - ${usuario.rol}`
//       );
//     });
//     console.log();

//     console.log("Consultando usuario específico:");
//     const usuarioEspecifico = await usuarioController.obtenerUsuarioPorId(
//       nuevoUsuario.id
//     );
//     if (usuarioEspecifico) {
//       console.log(
//         `Usuario encontrado: ${usuarioEspecifico.nombre} (${usuarioEspecifico.email})`
//       );
//     }
//     console.log();

//     // 3. UPDATE - Usando Promises
//     console.log("3. ✏️  UPDATE - Actualizando usuario (Promises)");
//     console.log("---------------------------------------------");

//     await usuarioController
//       .actualizarUsuario(nuevoUsuario.id, {
//         nombre: "Laura Rodríguez Gómez",
//         rol: "admin",
//       })
//       .then((usuario) => {
//         console.log("✅ Usuario actualizado:", usuario);
//         return usuario;
//       })
//       .catch((error) => {
//         console.error("❌ Error al actualizar usuario:", error.message);
//         throw error;
//       });

//     console.log();

//     // 4. DELETE - Usando Async/Await
//     console.log("4. 🗑️  DELETE - Eliminando usuario (Async/Await)");
//     console.log("----------------------------------------------");

//     console.log("Eliminación lógica (desactivar):");
//     const eliminadoLogicamente = await usuarioController.eliminarUsuario(
//       nuevoUsuario.id,
//       false
//     );
//     console.log(`✅ Usuario eliminado lógicamente: ${eliminadoLogicamente}`);

//     // Verificar que el usuario está inactivo
//     const usuarioInactivo = await usuarioController.obtenerUsuarioPorId(
//       nuevoUsuario.id
//     );
//     if (usuarioInactivo) {
//       console.log(
//         `Usuario ahora está: ${usuarioInactivo.activo ? "activo" : "inactivo"}`
//       );
//     }
//     console.log();

//     // Crear otro usuario para demostrar eliminación física
//     console.log("Creando otro usuario para eliminación física...");
//     const otroUsuario = await usuarioController.crearUsuario({
//       nombre: "Temporal User",
//       email: "temporal@example.com",
//       rol: "visitante",
//     });

//     console.log("Eliminación física (borrar completamente):");
//     const eliminadoFisicamente = await usuarioController.eliminarUsuario(
//       otroUsuario.id,
//       true
//     );
//     console.log(`✅ Usuario eliminado físicamente: ${eliminadoFisicamente}`);

//     // Verificar que el usuario ya no existe
//     const usuarioNoEncontrado = await usuarioController.obtenerUsuarioPorId(
//       otroUsuario.id
//     );
//     console.log(`Usuario aún existe: ${usuarioNoEncontrado !== null}`);
//     console.log();

//     // Verificación final
//     console.log("5. 🔍 VERIFICACIÓN FINAL");
//     console.log("------------------------");
//     const usuariosFinales = await usuarioController.obtenerUsuariosActivos();
//     console.log(`Total de usuarios activos: ${usuariosFinales.length}`);
//     usuariosFinales.forEach((usuario, index) => {
//       console.log(
//         `${index + 1}. ${usuario.nombre} (${usuario.email}) - ${usuario.rol}`
//       );
//     });
//   } catch (error) {
//     console.error("❌ Error en la ejecución:", error);
//   }
// }

// // Ejecutar el programa principal
// main()
//   .then(() => {
//     console.log("\n🎉 Programa ejecutado exitosamente!");
//   })
//   .catch((error) => {
//     console.error("\n💥 Error fatal:", error);
//     process.exit(1);
//   });
