import { RestauranteContainer } from "./restaurante/shared/container";

async function main() {
  console.log("🍽️  Sistema de Gestión de Restaurantes");
  console.log("=======================================\n");

  const container = RestauranteContainer.getInstance();
  const restauranteController = container.getRestauranteController();

  try {
    // 1. CREATE - Usando Callbacks
    console.log("1. 📝 CREATE - Creando nuevo restaurante (Callbacks)");
    console.log("---------------------------------------------------");

    const nuevoRestaurante = await restauranteController.crearRestaurante({
      nombre: "La Buena Mesa",
      descripcion: "Cocina fusión con ingredientes locales",
      ubicacion: "Av. Central 456, Ciudad",
      horariosAtencion: "Lun-Dom 09:00-22:00",
      capacidadTotal: 80,
    });

    console.log("✅ Restaurante creado:", nuevoRestaurante);
    console.log();

    // 2. READ - Usando Async/Await
    console.log("2. 📖 READ - Consultando restaurantes (Async/Await)");
    console.log("------------------------------------------------");

    console.log("Restaurantes activos:");
    const restaurantesActivos = await restauranteController.obtenerRestaurantesActivos();
    restaurantesActivos.forEach((restaurante, index) => {
      console.log(
        `${index + 1}. ${restaurante.nombre} — ${
          restaurante.ubicacion
        } (capacidad: ${restaurante.capacidadTotal})`
      );
    });
    console.log();

    console.log("Consultando restaurante específico:");
    const restauranteEspecifico =
      await restauranteController.obtenerRestaurantePorId(nuevoRestaurante.id);
    if (restauranteEspecifico) {
      console.log(
        `Restaurante encontrado: ${restauranteEspecifico.nombre} — ${restauranteEspecifico.ubicacion}`
      );
    }
    console.log();

    // 3. UPDATE - Usando Promises
    console.log("3. ✏️  UPDATE - Actualizando restaurante (Promises)");
    console.log("------------------------------------------------");

    await restauranteController
      .actualizarRestaurante(nuevoRestaurante.id, {
        nombre: "La Buena Mesa Gourmet",
        capacidadTotal: 90,
      })
      .then((restaurante) => {
        console.log("✅ Restaurante actualizado:", restaurante);
        return restaurante;
      })
      .catch((error) => {
        console.error("❌ Error al actualizar restaurante:", error.message);
        throw error;
      });

    console.log();

    // 4. DELETE - Usando Async/Await
    console.log("4. 🗑️  DELETE - Eliminando restaurante (Async/Await)");
    console.log("-------------------------------------------------");

    console.log("Eliminación lógica (marcar eliminado):");
    const eliminadoLogicamente =
      await restauranteController.eliminarRestaurante(
        nuevoRestaurante.id,
        false
      );
    console.log(
      `✅ Restaurante eliminado lógicamente: ${eliminadoLogicamente}`
    );

    // Verificar que ya no aparezca entre los activos
    const activosLuegoDeEliminar =
      await restauranteController.obtenerRestaurantesActivos();
    console.log(
      `Restaurantes activos después de eliminar: ${activosLuegoDeEliminar.length}`
    );
    console.log();

    // Crear otro restaurante para demostrar eliminación física
    console.log("Creando otro restaurante para eliminación física...");
    const otro = await restauranteController.crearRestaurante({
      nombre: "Temporal Resto",
      descripcion: "Temporal para demo",
      ubicacion: "Calle Falsa 123",
      horariosAtencion: "Mar-Sab 10:00-18:00",
      capacidadTotal: 20,
    });

    console.log("Eliminación física (borrar completamente):");
    const eliminadoFisicamente =
      await restauranteController.eliminarRestaurante(otro.id, true);
    console.log(
      `✅ Restaurante eliminado físicamente: ${eliminadoFisicamente}`
    );

    // Verificar que ya no existe
    const yaNoExiste = await restauranteController.obtenerRestaurantePorId(
      otro.id
    );
    console.log(`Restaurante aún existe: ${yaNoExiste !== null}`);
  } catch (error) {
    console.error("❌ Error en la ejecución:", error);
  }
}

// Ejecutar el programa principal
main()
  .then(() => {
    console.log("\n🎉 Programa ejecutado exitosamente!");
  })
  .catch((error) => {
    console.error("\n💥 Error fatal:", error);
    process.exit(1);
  });
