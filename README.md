# 📌 Proyecto Quejas-Boyacá - Taller Quejas - Sistema de Registro de Quejas

El sistema permite **registrar quejas relacionadas con entidades públicas de la región de Boyacá**,  
visualizar las quejas asociadas a cada entidad y **generar reportes detallados** por institución.  

🔗 **Enlace al despliegue:** [Proyecto Quejas-Boyacá](https://tallerquejas-production.up.railway.app/)

---

## 🚀 Tecnologías

- **Lenguaje principal:** Java 21  
- **Framework backend:** Spring Boot 3.5.4, Spring Data JPA (API REST, seguridad, persistencia con Hibernate)  
- **Base de datos:** MySQL 8.0 (conexión mediante Spring Data JPA)  
- **Hosting de BD:** Railway  
- **Frontend:** React 18 + Vite  
- **Gestor de dependencias backend:** Maven  
- **Estilos frontend:** CSS  
- **Librerías frontend:** Axios (peticiones HTTP)  
- **Control de versiones:** Git + GitHub  
- **Deployment:** Railway (Backend + Frontend + Base de Datos)  

---

## ⚙️ Requisitos previos (para uso en local)

Antes de instalar y ejecutar el proyecto, asegúrate de tener:  

- **MySQL** v8 o superior  
- **Java JDK** 17 o superior  
- **Node.js** v18 o superior (incluye npm)  
- **Maven**  

---

## 🔧 Instalación y configuración (uso en local)

### 1. Clonar el repositorio

```bash
  git clone https://github.com/grupo-Software-2/TALLER_QUEJAS.git
  cd TALLER_QUEJAS
```

### 2. Configuración del Backend

1. Ir al directorio: cd src/backend

2. Crear la base de datos en MySQL: CREATE DATABASE quejas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

3. Crear archivo src/main/resources/application-local.properties con tu configuración local:

spring.datasource.url=jdbc:mysql://localhost:3306/quejas_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=2

4. Instalar dependencias

mvn clean install
mvn spring-boot:run --spring.profiles.active=local

### 3. Configuración del Frontend

1. Ir al directorio: cd src/frontend

2. Instalar dependencias: npm install

3. Crear archivo .env.local:

VITE_API_URL=http://localhost:8080
VITE_RECAPTCHA_SITE_KEY=tu_recaptcha_site_key

### 4. Uso

1. Iniciar el backend:

cd src/backend
mvn spring-boot:run --spring.profiles.active=local

2. Iniciar el frontend:

cd src/frontend
npm run dev

http://localhost:5173

### 5. Estructura del Proyecto


TALLER_QUEJAS/
│── src/
│   ├── backend/        # API REST con Spring Boot
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── ...
│   │
│   └── frontend/       # Interfaz de usuario con React + Vite
│       ├── src/
│       ├── public/
│       └── ...
│
│── docs/               # Documentación adicional
│── README.md


### 6. Convenciones de Commits

Se sigue el estándar Conventional Commits:

feat: Nueva funcionalidad
fix: Corrección de errores
docs: Cambios en documentación
style: Formato, espacios, puntos y comas, etc.
refactor: Refactorización de código
test: Agregar o modificar tests

### 7. Problemas Comunes

Error de conexión a BD:
  Verificar que MySQL esté ejecutándose
  Confirmar credenciales en application.properties
  Revisar que la BD quejas_db exista

CORS Error:
  Verificar configuración de @CrossOrigin en controladores
  Confirmar URL del frontend en configuración CORS

Error en build del frontend:
  Ejecutar npm install para reinstalar dependencias
  Verificar versión de Node.js (>=18)

Limpiar caché:
  npm run build -- --force


### 8. Desarrollado por

  - Leandro Luis
  - María Medina
  - Nicolás Munevar

### 9. Licencia

Este proyecto es desarrollado con fines académicos para la Universidad Pedagógica y Tecnológica de Colombia (UPTC).
