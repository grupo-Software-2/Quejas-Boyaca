# ============================
# STAGE 1: Build Frontend (React + Vite)
# ============================
FROM node:20 AS frontend-build

WORKDIR /app

# Copiar config de frontend y cachear dependencias
COPY src/frontend/package*.json ./
RUN npm ci

# Copiar código y compilar
COPY src/frontend ./
RUN npm run build && rm -rf node_modules


# ============================
# STAGE 2: Build Backend (Java + Maven)
# ============================
FROM maven:3.9.6-eclipse-temurin-21 AS backend-build

WORKDIR /app

# Cachear dependencias
COPY src/backend/pom.xml ./
RUN mvn dependency:go-offline

# Copiar backend
COPY src/backend ./

# Copiar frontend dentro de resources (para servirlo con Spring)
COPY --from=frontend-build /app/dist ./src/main/resources/static

# Compilar backend
RUN mvn clean package -DskipTests && mv target/*.jar app.jar


# ============================
# STAGE 3: Runtime
# ============================
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copiar jar generado
COPY --from=backend-build /app/app.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
