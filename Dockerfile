# ============================
# STAGE 1: Build Frontend (React + Vite)
# ============================
FROM node:20 AS frontend-build

WORKDIR /app

# Copiar config de frontend
COPY src/frontend/package*.json ./
RUN npm install

# Copiar todo el frontend y construir
COPY src/frontend ./
RUN npm run build


# ============================
# STAGE 2: Build Backend (Java + Maven)
# ============================
FROM maven:3.9.6-eclipse-temurin-21 AS backend-build

WORKDIR /app

# Copiar pom.xml primero para cachear dependencias
COPY src/backend/pom.xml ./
RUN mvn dependency:go-offline

# Copiar código backend
COPY src/backend ./

# Copiar build del frontend dentro de resources (para que Spring lo sirva)
COPY --from=frontend-build /app/dist ./src/main/resources/static

# Compilar el backend
RUN mvn package -DskipTests


# ============================
# STAGE 3: Runtime
# ============================
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copiar el JAR del backend compilado
COPY --from=backend-build /app/target/*.jar app.jar

# Exponer el puerto (ajusta si tu backend usa otro)
EXPOSE 8080

# Correr la app
ENTRYPOINT ["java", "-jar", "app.jar"]
