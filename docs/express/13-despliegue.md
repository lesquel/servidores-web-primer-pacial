# 13 · Despliegue (Docker/PM2)

Dockerfile (Node 18+):

```Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

PM2 (opcional):

```json
{
  "apps": [
    {
      "name": "api",
      "script": "dist/server.js",
      "instances": "max",
      "exec_mode": "cluster",
      "env": { "NODE_ENV": "production" }
    }
  ]
}
```

Tips:

- Configura probes/health checks.
- Usa variables vía entorno (no COPY de .env en imágenes).
