# 16 · Scripts (package.json)

Scripts típicos para TS + Express:

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/server.js",
    "test": "jest",
    "lint": "eslint . --ext .ts",
    "format": "prettier --write ."
  }
}
```

Notas:

- `ts-node-dev` recarga en caliente; alternativa: `nodemon`.
- En producción usa `build` + `start` (no transpiles on-the-fly).
