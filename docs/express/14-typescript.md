# 14 · TypeScript (tsconfig y tips)

`tsconfig.json` sugerido:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "dist",
    "rootDir": "src",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@app/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

Tips:

- Usa tipos para DTOs inferidos desde Zod.
- Evita `any`; usa `unknown` y valida.
- Activa `strict` para detectar errores temprano.
