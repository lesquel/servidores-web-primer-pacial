FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
