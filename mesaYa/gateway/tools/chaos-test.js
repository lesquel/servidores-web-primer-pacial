/**
 * Script de prueba de caos para verificar idempotencia.
 * Envía 5 requests paralelas con la misma idempotencyKey.
 * Resultado esperado: 1 éxito, 4 conflictos (409).
 *
 * Uso:
 *   node chaos-test.js <token>
 *
 * Ejemplo:
 *   node chaos-test.js eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */

const GATEWAY_URL = process.env.GATEWAY_URL || "http://localhost:3000";

async function sendReservation(token, payload, index) {
  const start = Date.now();
  try {
    const response = await fetch(`${GATEWAY_URL}/api/v1/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    const duration = Date.now() - start;

    return {
      index,
      status: response.status,
      success: response.ok,
      duration,
      data,
    };
  } catch (error) {
    return {
      index,
      status: 0,
      success: false,
      duration: Date.now() - start,
      error: error.message,
    };
  }
}

async function runChaosTest() {
  const token = process.argv[2];

  if (!token) {
    console.log("❌ Uso: node chaos-test.js <jwt-token>");
    console.log("   Ejemplo: node chaos-test.js eyJhbGciOiJIUzI1...");
    process.exit(1);
  }

  // Generar una idempotencyKey única para esta prueba
  const idempotencyKey = `chaos-test-${Date.now()}-${Math.random()
    .toString(36)
    .substring(7)}`;

  const payload = {
    idempotencyKey,
    restaurantId: "550e8400-e29b-41d4-a716-446655440000", // UUID de ejemplo
    tableId: "550e8400-e29b-41d4-a716-446655440001", // UUID de ejemplo
    reservationDate: new Date(Date.now() + 86400000)
      .toISOString()
      .split("T")[0], // Mañana
    reservationTime: new Date(
      Date.now() + 86400000 + 3600000 * 19
    ).toISOString(), // 19:00
    numberOfGuests: 4,
  };

  console.log("🚀 Iniciando prueba de caos de idempotencia...\n");
  console.log("📋 Configuración:");
  console.log(`   - Gateway URL: ${GATEWAY_URL}`);
  console.log(`   - IdempotencyKey: ${idempotencyKey}`);
  console.log(`   - Requests paralelas: 5\n`);
  console.log("⏳ Enviando 5 requests paralelas...\n");

  // Enviar 5 requests en paralelo
  const promises = Array.from({ length: 5 }, (_, i) =>
    sendReservation(token, payload, i + 1)
  );

  const results = await Promise.all(promises);

  // Analizar resultados
  const successes = results.filter((r) => r.status === 201);
  const conflicts = results.filter((r) => r.status === 409);
  const errors = results.filter((r) => !r.success && r.status !== 409);

  console.log("📊 RESULTADOS:\n");
  console.log(
    "┌─────────┬────────┬──────────┬─────────────────────────────────┐"
  );
  console.log(
    "│ Request │ Status │ Duración │ Resultado                       │"
  );
  console.log(
    "├─────────┼────────┼──────────┼─────────────────────────────────┤"
  );

  results
    .sort((a, b) => a.index - b.index)
    .forEach((r) => {
      const status =
        r.status === 201
          ? "✅ 201"
          : r.status === 409
          ? "⚠️ 409"
          : `❌ ${r.status}`;
      const result =
        r.status === 201
          ? "Reserva creada"
          : r.status === 409
          ? "Duplicado rechazado"
          : r.error || "Error";
      console.log(
        `│    ${r.index}    │ ${status} │  ${r.duration
          .toString()
          .padStart(4)}ms  │ ${result.padEnd(31)} │`
      );
    });

  console.log(
    "└─────────┴────────┴──────────┴─────────────────────────────────┘\n"
  );

  console.log("📈 RESUMEN:");
  console.log(`   ✅ Éxitos (201):    ${successes.length}`);
  console.log(`   ⚠️  Conflictos (409): ${conflicts.length}`);
  console.log(`   ❌ Errores:         ${errors.length}\n`);

  // Verificar resultado esperado
  if (successes.length === 1 && conflicts.length === 4) {
    console.log("🎉 ¡PRUEBA EXITOSA! La idempotencia funciona correctamente.");
    console.log("   - Solo 1 reserva fue creada");
    console.log("   - 4 duplicados fueron rechazados correctamente");
  } else if (successes.length === 0) {
    console.log("❌ PRUEBA FALLIDA: Ninguna reserva fue creada.");
    console.log("   Verifica que:");
    console.log("   - El token JWT sea válido");
    console.log("   - Los UUIDs de restaurante/mesa existan");
    console.log("   - Los servicios estén corriendo");
  } else if (successes.length > 1) {
    console.log("❌ PRUEBA FALLIDA: Se crearon múltiples reservas duplicadas.");
    console.log("   La idempotencia NO está funcionando correctamente.");
    console.log(`   Se crearon ${successes.length} reservas en lugar de 1.`);
  }
}

runChaosTest().catch(console.error);
