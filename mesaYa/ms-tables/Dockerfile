FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY dist ./dist

CMD ["npm", "run", "start:prod"]
