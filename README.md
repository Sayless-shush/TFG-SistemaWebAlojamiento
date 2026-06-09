# Sistema Web de Asignación Automática de Alojamiento en Eventos Deportivos
## Tecnologías utilizadas

**Frontend:**
* **React:** Librería principal para la construcción de la interfaz.
* **Ant Design (antd):** Biblioteca de componentes UI para un diseño limpio y profesional.
* **Day.js:** Gestión, parseo y formato de fechas de manera ligera y optimizada.


**Backend:**
* **Node.js & Express:** Entorno de ejecución y framework para la creación de la API RESTful.
* **MySQL:** Base de datos relacional.


## Requisitos Previos

Para ejecutar este proyecto en un entorno local, necesitas tener instalado:
* [Node.js](https://nodejs.org/) (versión 14 o superior)
* [MySQL](https://www.mysql.com/)

## Instalación y Configuración

**1. Clonar el repositorio**

bash

git clone [URL_DE_TU_REPOSITORIO]

cd [NOMBRE_DE_TU_CARPETA]


**2. Configurar la Base de Datos**
* Inicia tu servidor MySQL.
* Crea una base de datos vacía.
* Importa el esquema y los datos iniciales utilizando el archivo SQL proporcionado (por ejemplo, `database.sql` o el nombre que le hayas dado a tu script de base de datos).

**3. Configurar las Variables de Entorno (.env)**
* Navega a la carpeta del backend.
* Crea un archivo llamado `.env` basándote en el archivo de ejemplo (si existe) o añade las siguientes credenciales:
env

DB_HOST=localhost

DB_USER=tu_usuario_mysql

DB_PASSWORD=tu_contraseña_mysql

DB_NAME=nombre_de_la_base_de_datos

PORT=3000


**4. Instalar Dependencias**
El proyecto está dividido en dos carpetas principales: `frontend` y `backend`. Debes instalar las dependencias en ambas.

En la terminal del servidor (Backend):

bash

cd backend

npm install



En la terminal del cliente (Frontend):

bash

cd frontend

npm install



## Ejecución del Proyecto

Para levantar la aplicación, necesitas ejecutar ambas partes simultáneamente en dos terminales distintas.

**Iniciar el servidor (Backend):**

cd backend

node index.js


**Iniciar la interfaz de usuario (Frontend):**

cd frontend

npm start

**luego en opción de yes/no pulsa**

y
