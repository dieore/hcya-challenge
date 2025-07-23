# HCyA Challenge

Este proyecto es una aplicación web que muestra una lista de productos. Incluye una aplicación frontend construida con React y una API backend que sirve datos de productos desde un archivo JSON.

## Características

- Ver una lista de productos
- Crear, editar y eliminar productos
- Filtrar productos por nombre, categoría, subcategoría, marca y precio
- Ordenar productos
- Buscar productos por nombre
- Mostrar detalles de un producto

## Instrucciones

Estas instrucciones te guiarán a través del proceso de clonación y ejecución del proyecto en tu máquina local.

### Requisitos

- Node.js (v18 or higher)
- pnpm

### Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/diegoorefici/hcya-challenge.git
   cd hcya-challenge
   ```

2. **Instalar dependencias de la API:**

   ```bash
   cd hcya-challenge-api
   pnpm install
   ```

3. **Instalar dependencias del frontend:**

   ```bash
   cd ../hcya-challenge-app
   pnpm install
   ```

### Ejecución

1. **Iniciar la API:**

   ```bash
   cd hcya-challenge-api
   pnpm start
   ```

   La API se ejecutará en `http://localhost:3000`.

2. **Iniciar la aplicación frontend:**

   ```bash
   cd hcya-challenge-app
   pnpm dev
   ```
   La aplicación frontend se ejecutará en `http://localhost:5173`.
