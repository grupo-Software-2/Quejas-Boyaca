# Proyecto Quejas-Boyacá - Taller Quejas

El software permite **registrar quejas relacionadas con entidades públicas de la región de Boyacá**,  
visualizar las quejas asociadas a cada entidad y **generar reportes detallados** por institución.

**Enlace al despliegue:** [Proyecto Quejas-Boyacá](https://tallerquejas-production.up.railway.app/)

---

## Tecnologías

- **Lenguaje principal:** Java 17  
- **Framework backend:** Spring Boot (API REST, seguridad, persistencia con JPA/Hibernate)  
- **Base de datos:** MySQL (conexión mediante Spring Data JPA)  
- **Frontend:** React + Vite (interfaz de usuario rápida y modular)  
- **Gestor de dependencias backend:** Maven  
- **Estilos frontend:** CSS  
- **Control de versiones:** Git + GitHub  

---

## Requisitos previos (para uso en local)

Antes de instalar y ejecutar el proyecto, asegúrate de tener instalado:  

- **MySQL** v9 o superior  
- **Java JDK** 17 o superior  
- **Node.js** (incluye npm)  
- **React** (se instala automáticamente al ejecutar `npm install` en frontend)  
- **Maven** (para la gestión de dependencias en el backend)  

---

## Instalación (uso en local)

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/grupo-Software-2/TALLER_QUEJAS.git
2. Acceder al directorio del proyecto:
   cd TALLER_QUEJAS

Backend
   1. cd src - cd backend
   2. mvn install

Frontend
   1. cd src - cd frontend
   2. npm install
      
## Uso (ejecución en local)

Backend
   Ejecutar desde el directorio backend/
   mvn spring-boot:run
Frontend
   Ejecutar desde el directorio frontend/:
   npm run dev
   
Una vez ambos estén corriendo, abre en el navegador:
http://localhost:5173
 (puerto de Vite para frontend)
   
## Desarrollado por

  - Leandro Luis
  - María Medina
  - Nicolás Munevar
