# ============================
# STAGE 1: Build Frontend (React + Vite)
# ============================
FROM node:20 AS frontend-build

WORKDIR /app

# Copiar solo package.json y package-lock.json para cachear deps
COPY src/frontend/package*.json ./

# Instalar dependencias (npm ci es más confiable en CI/CD)
RUN npm ci

# Copiar el resto del frontend
COPY src/frontend ./

# Build optimizado con más memoria (evita errores de OOM)
ENV NODE_OPTIONS=--max-old-space-size=2048
RUN npm run build

COPY --from=frontend-build /app/dist ./src/main/resources/static

# ============================
# STAGE 2: Build Backend (Java + Maven)
# ============================
FROM maven:3.9.6-eclipse-temurin-21 AS backend-build

WORKDIR /app

# Copiar solo pom.xml para cachear dependencias
COPY src/backend/pom.xml ./

# Cachear dependencias offline (aumenta memoria)
RUN MAVEN_OPTS="-Xmx1024m" mvn dependency:go-offline

# Copiar backend completo
COPY src/backend ./ 

# Copiar frontend build al backend
COPY --from=frontend-build /app/dist ./src/main/resources/static

# Compilar backend y generar jar
RUN MAVEN_OPTS="-Xmx1024m" mvn clean package -DskipTests
RUN cp target/*.jar app.jar

# ============================
# STAGE 3: Runtime
# ============================
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copiar jar
COPY --from=backend-build /app/app.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
