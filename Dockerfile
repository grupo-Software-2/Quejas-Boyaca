# Etapa 1: build frontend
FROM node:18 AS frontend
WORKDIR /app/frontend
COPY src/frontend/package*.json ./
RUN npm install
COPY src/frontend .
RUN npm run build

# Etapa 2: backend
FROM node:18
WORKDIR /app
COPY src/backend/package*.json ./
RUN npm install
COPY src/backend .
# Copiar build del frontend al backend (ej: si usas Express para servirlo)
COPY --from=frontend /app/frontend/dist ./public

EXPOSE 3000
CMD ["npm", "start"]
