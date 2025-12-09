/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                     CHAOS TEST - IDEMPOTENCIA AVANZADA                        ║
 * ║               MesaYa Microservices - Opción B (Idempotent Consumer)           ║
 * ╠═══════════════════════════════════════════════════════════════════════════════╣
 * ║ Este script simula un escenario de caos donde múltiples solicitudes           ║
 * ║ con la misma idempotencyKey llegan simultáneamente (race condition).          ║
 * ║                                                                               ║
 * ║ RESULTADO ESPERADO:                                                           ║
 * ║   ✅ 1 solicitud exitosa (201 Created)                                        ║
 * ║   🚫 4 solicitudes rechazadas (409 Conflict - duplicadas)                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 *
 * USO:
 *   1. Obtener un JWT válido del backend
 *   2. node chaos-test.js <JWT_TOKEN>
 *
 * EJEMPLO:
 *   node chaos-test.js eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */

const GATEWAY_URL = process.env.GATEWAY_URL || "http://localhost:3000";
const JWT_TOKEN = process.argv[2];

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════════════════════════════════════════

const IDEMPOTENCY_KEY = `chaos-test-${Date.now()}-${Math.random()
  .toString(36)
  .substring(7)}`;
const CONCURRENT_REQUESTS = 5;

// Datos de la reserva de prueba
const reservationPayload = {
  idempotencyKey: IDEMPOTENCY_KEY,
  restaurantId: "550e8400-e29b-41d4-a716-446655440000", // UUID de restaurante de prueba
  tableId: "123e4567-e89b-12d3-a456-426614174000", // UUID de mesa de prueba
  reservationDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0], // Mañana
  reservationTime: new Date(
    Date.now() + 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000
  ).toISOString(), // Mañana 19:00
  numberOfGuests: 4,
};

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Colores para la consola
 */
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

function log(color, emoji, message) {
  console.log(`${colors[color]}${emoji} ${message}${colors.reset}`);
}

function printHeader() {
  console.log("\n" + colors.cyan + "═".repeat(75) + colors.reset);
  console.log(
    colors.bright +
      colors.cyan +
      "   🧪 CHAOS TEST - PATRÓN IDEMPOTENT CONSUMER" +
      colors.reset
  );
  console.log(colors.cyan + "═".repeat(75) + colors.reset + "\n");
}

function printConfig() {
  console.log(colors.yellow + "📋 Configuración:" + colors.reset);
  console.log(`   Gateway URL:        ${GATEWAY_URL}`);
  console.log(`   Solicitudes:        ${CONCURRENT_REQUESTS} (simultáneas)`);
  console.log(`   IdempotencyKey:     ${IDEMPOTENCY_KEY}`);
  console.log(
    `   JWT Token:          ${
      JWT_TOKEN ? JWT_TOKEN.substring(0, 30) + "..." : "❌ NO PROPORCIONADO"
    }`
  );
  console.log();
}

/**
 * Realiza una solicitud HTTP POST
 */
async function makeRequest(requestId) {
  const startTime = Date.now();

  try {
    const response = await fetch(`${GATEWAY_URL}/api/v1/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT_TOKEN}`,
        "X-Request-ID": `chaos-${requestId}-${Date.now()}`,
      },
      body: JSON.stringify(reservationPayload),
    });

    const duration = Date.now() - startTime;
    const data = await response.json().catch(() => ({}));

    return {
      requestId,
      status: response.status,
      duration,
      success: response.status === 201,
      duplicate: response.status === 409,
      data,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      requestId,
      status: 0,
      duration,
      success: false,
      duplicate: false,
      error: error.message,
    };
  }
}

/**
 * Imprime los resultados de una solicitud
 */
function printResult(result) {
  const { requestId, status, duration, success, duplicate, data, error } =
    result;

  if (success) {
    log(
      "green",
      "✅",
      `Request #${requestId}: 201 Created (${duration}ms) - Reserva creada: ${
        data?.data?.id || "N/A"
      }`
    );
  } else if (duplicate) {
    log(
      "yellow",
      "🚫",
      `Request #${requestId}: 409 Conflict (${duration}ms) - ${
        data?.message || "Duplicada"
      }`
    );
  } else if (error) {
    log("red", "❌", `Request #${requestId}: Error (${duration}ms) - ${error}`);
  } else {
    log(
      "red",
      "⚠️",
      `Request #${requestId}: ${status} (${duration}ms) - ${JSON.stringify(
        data
      )}`
    );
  }
}

/**
 * Imprime el resumen final
 */
function printSummary(results) {
  const successful = results.filter((r) => r.success).length;
  const duplicates = results.filter((r) => r.duplicate).length;
  const errors = results.filter((r) => !r.success && !r.duplicate).length;
  const avgDuration = Math.round(
    results.reduce((sum, r) => sum + r.duration, 0) / results.length
  );

  console.log("\n" + colors.cyan + "═".repeat(75) + colors.reset);
  console.log(colors.bright + "   📊 RESUMEN DE RESULTADOS" + colors.reset);
  console.log(colors.cyan + "═".repeat(75) + colors.reset + "\n");

  console.log(
    `   ${colors.green}✅ Exitosas:${colors.reset}      ${successful}`
  );
  console.log(
    `   ${colors.yellow}🚫 Duplicadas:${colors.reset}    ${duplicates}`
  );
  console.log(`   ${colors.red}❌ Errores:${colors.reset}       ${errors}`);
  console.log(`   ⏱️  Tiempo prom:    ${avgDuration}ms`);
  console.log();

  // Verificación del patrón idempotente
  console.log(colors.cyan + "─".repeat(75) + colors.reset);

  if (successful === 1 && duplicates === CONCURRENT_REQUESTS - 1) {
    console.log(colors.green + colors.bright);
    console.log(
      "   🎉 ¡ÉXITO! El patrón Idempotent Consumer funciona correctamente."
    );
    console.log("   ");
    console.log(
      "   Solo 1 reserva fue creada, las demás fueron rechazadas como"
    );
    console.log("   duplicadas gracias al bloqueo distribuido en Redis.");
    console.log(colors.reset);
  } else if (successful === 0) {
    console.log(colors.yellow + colors.bright);
    console.log("   ⚠️  Ninguna solicitud fue exitosa.");
    console.log("   ");
    console.log("   Posibles causas:");
    console.log("   - JWT inválido o expirado");
    console.log("   - Gateway no disponible");
    console.log("   - Error de validación en los datos");
    console.log(colors.reset);
  } else if (successful > 1) {
    console.log(colors.red + colors.bright);
    console.log("   ❌ PROBLEMA: Múltiples reservas fueron creadas.");
    console.log("   ");
    console.log("   Esto indica que el patrón idempotente NO está funcionando");
    console.log(
      "   correctamente. Revisar la implementación del bloqueo en Redis."
    );
    console.log(colors.reset);
  }

  console.log(colors.cyan + "═".repeat(75) + colors.reset + "\n");
}

// ═══════════════════════════════════════════════════════════════════════════════
// EJECUCIÓN PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

async function runChaosTest() {
  printHeader();
  printConfig();

  if (!JWT_TOKEN) {
    console.log(
      colors.red +
        "❌ Error: Se requiere un JWT Token como argumento." +
        colors.reset
    );
    console.log("\n   Uso: node chaos-test.js <JWT_TOKEN>\n");
    console.log("   Para obtener un JWT, autentícate en el backend:\n");
    console.log("   curl -X POST http://localhost:3001/api/auth/login \\");
    console.log('        -H "Content-Type: application/json" \\');
    console.log(
      '        -d \'{"email": "user@example.com", "password": "password"}\''
    );
    console.log();
    process.exit(1);
  }

  log("blue", "🚀", "Iniciando chaos test...\n");
  log(
    "cyan",
    "📤",
    `Enviando ${CONCURRENT_REQUESTS} solicitudes simultáneas con la misma idempotencyKey...\n`
  );

  // Crear todas las promesas de solicitud
  const requestPromises = Array.from({ length: CONCURRENT_REQUESTS }, (_, i) =>
    makeRequest(i + 1)
  );

  // Ejecutar todas simultáneamente
  const results = await Promise.all(requestPromises);

  // Imprimir resultados individuales
  console.log(
    colors.magenta + "\n📋 Resultados individuales:\n" + colors.reset
  );
  results.forEach(printResult);

  // Imprimir resumen
  printSummary(results);
}

// Ejecutar
runChaosTest().catch(console.error);
