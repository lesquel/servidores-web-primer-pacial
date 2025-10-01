# 99 · FAQ

- ¿Express 5 es estable? Sí, la rama 5.x es estable y recomendada.
- ¿Necesito TypeScript? No, pero mejora DX y reduce bugs.
- ¿Zod vs Joi/Yup? Zod integra mejor con TS (inferencias) y tiene buena DX.
- ¿Swagger es obligatorio? No, pero facilita colaboración y pruebas.
- ¿Cómo versiono la API? Prefiere `/api/v1` y planea `v2` cuando rompas compatibilidad.
- ¿Puedo usar ES Modules? Sí, pero adapta `tsconfig` y `type: module` en package.json.
- ¿Cómo manejo CORS en producción? Permite solo dominios confiables y usa HTTPS.
