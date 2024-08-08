# PROYECTECA SERVIDOR - Servidor Express

Este proyecto es el servidor backend para la aplicación cliente-servidor desarrollada con React, TypeScript y Vite. Está construido con Express y utiliza varias herramientas para proporcionar una API RESTful para la gestión de proyectos, usuarios, y más.

## Descripción

PROYECTECA es el backend de una aplicación que maneja proyectos y usuarios, con funcionalidades para agregar, editar, eliminar y consultar proyectos. Utiliza Express para la creación de rutas y Multer para el manejo de archivos PDF. La base de datos MySQL se utiliza para almacenar información sobre proyectos y usuarios.

## Estructura del Proyecto

- **Express**: Framework para construir el servidor y manejar rutas.
- **Multer**: Middleware para la gestión de archivos, especialmente para manejar archivos PDF.
- **Cors**: Middleware para manejar los permisos de CORS.
- **Dotenv**: Para cargar variables de entorno desde un archivo `.env`.
- **MySQL**: Base de datos para almacenar la información de proyectos y usuarios.
- **Socket.io**: Para manejar conexiones WebSocket, si es necesario.

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar los siguientes comandos:

- **`npm run start`**: Inicia el servidor con Nodemon para el desarrollo. El servidor se ejecutará en `http://localhost:5003` por defecto.

## Dependencias Principales

- **`express`**: Framework para construir el servidor y manejar rutas.
- **`cors`**: Middleware para manejar CORS.
- **`dotenv`**: Para la configuración de variables de entorno.
- **`multer`**: Middleware para manejar archivos.
- **`mysql`**: Cliente MySQL para la base de datos.
- **`socket.io`**: Biblioteca para manejar conexiones WebSocket.

## Dependencias de Desarrollo

- **`nodemon`**: Herramienta para reiniciar automáticamente el servidor durante el desarrollo.

## Instalación

1. Clona este repositorio:
    ```bash
    git clone https://github.com/tu-usuario/nombre-del-repositorio.git
    ```

2. Navega al directorio del proyecto:
    ```bash
    cd nombre-del-repositorio
    ```

3. Instala las dependencias:
    ```bash
    npm install
    ```

## Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
PORT=5003
DBHOST=localhost
DBUSER=root
DBPASS=
DBNAME=proyecteca



## Configuración de ESLint

Para mantener la calidad del código, configura ESLint en el proyecto de la siguiente manera:

1. Configura la propiedad `parserOptions` en el archivo `.eslintrc.js`:

    ```js
    export default {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: __dirname,
      },
    }
    ```

2. Reemplaza `plugin:@typescript-eslint/recommended` con `plugin:@typescript-eslint/recommended-type-checked` o `plugin:@typescript-eslint/strict-type-checked`.

3. Opcionalmente, añade `plugin:@typescript-eslint/stylistic-type-checked`.

4. Instala y configura `eslint-plugin-react`:

    ```bash
    npm install eslint-plugin-react --save-dev
    ```

    ```js
    extends: [
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
    ],
    ```



Gracias por contribuir y utilizar PROYECTECA. Si tienes alguna pregunta o sugerencia, no dudes en abrir un issue o contactarnos.

