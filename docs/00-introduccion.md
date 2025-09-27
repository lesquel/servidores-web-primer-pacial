# 00 · Introducción

Express es un framework minimalista para Node.js. La versión 5 (estable) mejora el enrutado, soporte de Promesas/async y la consistencia del API.

Objetivos de esta guía:

- Crear una API REST mantenible, segura y con buen rendimiento.
- Usar TypeScript para tipado y DX (developer experience).
- Integrar validación, manejo de errores, logging y documentación.

Cuándo usar Express:

- APIs HTTP/REST, BFFs o microservicios con control fino sobre el stack.
- Cuando necesitas un ecosistema maduro con muchas librerías.

Qué aprenderás:

- Estructurar un proyecto por capas (domain, application, infrastructure, presentation).
- Validar datos con Zod, documentar con OpenAPI, probar con Jest/Supertest.
- Buenas prácticas de seguridad y despliegue (Docker/PM2).
