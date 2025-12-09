#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════
# Script para crear las dos bases de datos (db_mesas y db_reservas)
# Se ejecuta automáticamente al iniciar el contenedor de Postgres
# ═══════════════════════════════════════════════════════════════════════

set -e

echo "🗄️  Creando bases de datos para MesaYa Microservices..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Base de datos para el microservicio de mesas (Entidad Maestra)
    CREATE DATABASE db_mesas;
    GRANT ALL PRIVILEGES ON DATABASE db_mesas TO $POSTGRES_USER;

    -- Base de datos para el microservicio de reservas (Entidad Transaccional)
    CREATE DATABASE db_reservas;
    GRANT ALL PRIVILEGES ON DATABASE db_reservas TO $POSTGRES_USER;
EOSQL

echo "✅ Bases de datos db_mesas y db_reservas creadas exitosamente!"
