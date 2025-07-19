### HCyA Frontend Challenge

# 🎯 Objetivo
Construir una interfaz de usuario moderna, funcional y responsiva para la administración de productos, consumiendo una API REST. 

Recursos
La app está inicializada con React, Vite y Typescript. Se encuentra configurado el store con Redux Toolkit y se disponen los servicios para consumir la API. La API es un JSON Server de fácil instalación local lista para consumir.


# 🖥️ Funcionalidades requeridas
📌 1. Menú lateral
Menú lateral expandible y colapsable.
- Cada ítem del menú debe abrirse en una nueva solapa (tab).
- Las solapas deben mantener su estado, incluso si se cambia de pestaña (ej: filtros, datos cargados, campos editados).


📌 2. Módulo de ABM de productos
Implementar una interfaz que permita:
✅ Obtener (listar)

✅ Crear

✅ Editar

✅ Eliminar productos


Se valorarán los siguientes puntos con enfoque centrado en la experiencia de usuario:
- La utilización de selectores múltiples que permitan concatenar filtros para:
    Super-Categoría → Categoría → Subcategoría
    Marca

- Mostrar los productos en una tabla paginada que muestre de forma clara el total de resultados, propiedades, que permita ordenar y filtrar campos de texto por búsqueda parcial.

- Abrir los formularios de creación/edición en modales o en un panel lateral/tab adicional.

- Validar los campos requeridos (nombre, precio, stock, marca, categoría, subcategoría).

- Mostrar mensajes claros al usuario ante operaciones exitosas, errores de validación o comunicación con el servidor. 

- Alertar ante la posibilidad de salir de la sección y perder cambios no guardados.


ℹ️ Podés agregar o quitar librerías que prefieras. Tenés total libertad para mostrar tus conocimientos.


# 📦 Formato de entrega
El resultado del challenge debe entregarse mediante un repositorio público y una URL accesible en Internet:
1. Repositorio en GitHub/GitLab/Bitbucket
Debe contener:
Todo el código fuente del proyecto frontend.


Instrucciones para levantar en local.
Plus (deseables que suman puntos):
Un enlace al despliegue público de la aplicación.
Opciones gratuitas:
Vercel
Netlify
Render
Glitch


