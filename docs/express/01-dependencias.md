# 01 · Dependencias recomendadas (Express 5 + TS)

Producción:

- express: framework HTTP.
- cors: control de orígenes permitidos.
- helmet: cabeceras de seguridad.
- compression: gzip/brotli para respuestas.
- zod: validación de esquemas y DTOs.
- pino y pino-http: logging rápido y estructurado.
- express-rate-limit: limitar peticiones maliciosas.
- swagger-ui-express: servir documentación OpenAPI.
- http-status-codes: constantes de códigos HTTP.
- envalid: validación de variables de entorno.

Desarrollo:

- typescript: lenguaje tipado.
- ts-node-dev o nodemon + ts-node: recarga en desarrollo.
- @types/\*: tipos para paquetes (express, cors, etc.).
- eslint, @typescript-eslint/\*, prettier: calidad y formato.
- jest, ts-jest, supertest: pruebas unitarias e integración.

Notas:

- Express 5 es la versión actual (npm i express).
- Usa Node.js LTS (>= 18) para mejor compatibilidad.

Instalación con npm (ejemplo):

```powershell
npm i express cors helmet compression zod pino pino-http express-rate-limit swagger-ui-express http-status-codes envalid
npm i -D typescript ts-node-dev @types/node @types/express @types/cors @types/helmet @types/compression eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier jest ts-jest supertest @types/supertest
```

Alternativas:

- pnpm: reemplaza `npm i` por `pnpm add` y `pnpm add -D`.
- bun: `bun add` y `bun add -d` (requiere adaptar scripts).
