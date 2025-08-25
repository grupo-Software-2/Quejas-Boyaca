# =====================
# Etapa 1: Build Frontend
# =====================
FROM node:20 AS frontend-build
WORKDIR /app/frontend

# Copiar frontend
COPY src/frontend/package.json src/frontend/package-lock.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# =====================
# Etapa 2: Build Backend con Maven
# =====================
FROM maven:3.9.6-eclipse-temurin-21 AS backend-build
WORKDIR /app

# Copiar backend
COPY backend/pom.xml .
RUN mvn dependency:go-offline

COPY src/backend/ .
# Copiar build del frontend dentro de Spring Boot (para servir React desde static)
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static

RUN mvn clean package -DskipTests

# =====================
# Etapa 3: Imagen Final
# =====================
FROM eclipse-temurin:21-jdk
WORKDIR /app

COPY --from=backend-build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
