# Sistema de Registro de Quejas

Aplicación web para la gestión y registro de quejas ciudadanas dirigidas a entidades públicas de Boyacá, desarrollada como proyecto académico con tecnologías modernas.

## 🌐 Enlace de Despliegue

🔗 **[Ver aplicación desplegada](https://tallerquejas-production.up.railway.app/)**

---

## Equipo de Desarrollo

- **Leandro Luis**
- **Maria Medina**  
- **Nicolas Munevar**

---

## Tecnologías Utilizadas

### Backend
- **Java 21**
- **Spring Boot 3.5.4**
- **Spring Data JPA**
- **MySQL 8.0**
- **Maven**

### Frontend
- **React 18**
- **Vite**
- **Axios**
- **JavaScript ES6+**

### Base de Datos
- **MySQL**
- **Railway (Hosting de BD)**

### Deployment
- **Railway** (Backend + Base de Datos)

---

## Funcionalidades Principales

### Registro de Quejas
- Formulario intuitivo para crear nuevas quejas
- Validación de texto (máximo 1000 caracteres)
- Selección de entidad mediante dropdown
- Captura automática de IP y timestamp

### Consulta de Quejas
- Visualización de quejas por entidad específica
- Lista organizada con fecha y contenido
- Interfaz clara y fácil de navegar

### Reportes Estadísticos
- Dashboard con conteo de quejas por entidad
- Acceso protegido con verificación captcha

---

## Instalación y Configuración

### Prerrequisitos

- **Java 21** o superior
- **Node.js 18** o superior
- **MySQL 8.0**
- **Maven 3.6+**
- **Git**

### Configuración del Backend

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tuusuario/TALLER_QUEJAS.git
   cd TALLER_QUEJAS/src/backend
   ```

2. **Configurar Base de Datos**
   
   Crear archivo `src/main/resources/application-local.properties`:
   ```properties
   # Configuración local de MySQL
   spring.datasource.url=jdbc:mysql://localhost:3306/quejas_db?useSSL=false&serverTimezone=UTC
   spring.datasource.username=tu_usuario
   spring.datasource.password=tu_password
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   
   # JPA/Hibernate
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
   
   # Pool de conexiones
   spring.datasource.hikari.maximum-pool-size=10
   spring.datasource.hikari.minimum-idle=2
   ```

3. **Crear base de datos**
   ```sql
   CREATE DATABASE quejas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. **Instalar dependencias y ejecutar**
   ```bash
   # Linux/Mac
   ./mvnw clean install
   ./mvnw spring-boot:run --spring.profiles.active=local
   
   # Windows
   mvnw.cmd clean install
   mvnw.cmd spring-boot:run --spring.profiles.active=local
   ```

   El backend estará disponible en: `http://localhost:8080`

### 🎨 Configuración del Frontend

1. **Navegar al directorio frontend**
   ```bash
   cd ../frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear archivo `.env.local`:
   ```env
   VITE_API_URL=http://localhost:8080
   VITE_RECAPTCHA_SITE_KEY=tu_recaptcha_site_key
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

   El frontend estará disponible en: `http://localhost:5173`

---

## Arquitectura del Proyecto

```
TALLER_QUEJAS/
├── src/
│   ├── backend/                 # API Spring Boot
│   │   ├── src/main/java/
│   │   │   └── com/uptc/complaint_sistem/
│   │   │       ├── controller/  # Controladores REST
│   │   │       ├── model/       # Entidades JPA
│   │   │       ├── repository/  # Repositorios de datos
│   │   │       └── service/     # Lógica de negocio
│   │   ├── src/main/resources/
│   │   │   └── application.properties
│   │   └── pom.xml             # Dependencias Maven
│   │
│   └── frontend/               # Aplicación React
│       ├── src/
│       │   ├── components/     # Componentes React
│       │   ├── App.jsx        # Componente principal
│       │   └── main.jsx       # Punto de entrada
│       ├── package.json       # Dependencias NPM
│       └── vite.config.js     # Configuración Vite
│
└── README.md
```

---

## Scripts de Desarrollo

### Backend
```bash
# Compilar proyecto
./mvnw clean compile

# Ejecutar tests
./mvnw test

# Crear JAR
./mvnw clean package

# Ejecutar aplicación
./mvnw spring-boot:run
```

### Frontend
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

---

## Testing

### Ejecutar Tests del Backend
```bash
cd src/backend
./mvnw test
```

### Tests Manuales Recomendados

1. **Registro de quejas**
   - Probar con diferentes entidades
   - Validar límite de 1000 caracteres
   - Verificar campos requeridos

2. **Consulta por entidad**
   - Verificar filtrado correcto
   - Comprobar formato de fechas

3. **Reportes**
   - Validar conteo de quejas
   - Verificar funcionamiento del captcha

---

## 🐛 Troubleshooting

### Problemas Comunes

**Error de conexión a BD:**
- Verificar que MySQL esté ejecutándose
- Confirmar credenciales en `application.properties`
- Revisar que la BD `quejas_db` exista

**CORS Error:**
- Verificar configuración de `@CrossOrigin` en controladores
- Confirmar URL del frontend en configuración CORS

**Build Error del Frontend:**
- Ejecutar `npm install` para reinstalar dependencias
- Verificar versión de Node.js (>=18)
- Limpiar caché: `npm run build -- --force`

---

### Convenciones de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de errores
- `docs:` Cambios en documentación
- `style:` Formato, punto y coma faltantes, etc.
- `refactor:` Refactoring de código
- `test:` Agregar tests

---

## Licencia

Este proyecto es desarrollado con fines académicos para la Universidad Pedagógica y Tecnológica de Colombia (UPTC).