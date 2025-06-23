E-commerce
FrontEnd: ---->
Este es el frontend de un proyecto de e-commerce, diseñado para interactuar con un backend API RESTful (que ya he estado desarrollando). Proporciona una interfaz de usuario para explorar productos, gestionar un carrito de compras, y autenticarse como usuario, con diferentes niveles de acceso.

Características Principales
Página Principal de Productos: Muestra una lista de productos disponibles, con imágenes, nombres y precios.
Detalle de Producto: Permite ver información más detallada de un producto individual.
Carrito de Compras: Funcionalidad para añadir productos al carrito, ajustar cantidades y eliminarlos.
Autenticación de Usuario:
Registro: Formularios para que nuevos usuarios creen una cuenta.
Inicio de Sesión: Formularios para que los usuarios existentes accedan.
Cierre de Sesión: Funcionalidad para terminar la sesión del usuario.
Roles de Usuario: La interfaz se adapta para mostrar funcionalidades específicas basadas en el rol del usuario (cliente, admin, superAdmin), como paneles de administración o herramientas de gestión.
Consumo de API RESTful: Se comunica con el backend para todas las operaciones de datos (CRUD de productos, gestión de usuarios, etc.).
Estructura del Proyecto:

.
├── pages/                 
│   ├── admin.html
│   ├── cart.html
│   ├── index.html
│   ├── login.html
│   ├── products.html
│   └── register.html
└── assets/                 
    ├── styles/
    │   └── style.css       
    └── js/                
        ├── admin.js
        ├── auth.js
        ├── cart.js
        ├── cartDropdown.js
        ├── dropdownFilter.js
        ├── modal.js
        └── products.js
    └── sprite.svg          
    
Tecnologías Utilizadas
HTML5: Estructura de las páginas web.
CSS3: Estilos y diseño visual.
JavaScript (ES6+): Lógica interactiva del frontend, manejo de eventos y llamadas asíncronas.
Fecth API / Axios: Para realizar peticiones HTTP al backend.
Cómo Ejecutar el Proyecto
Clona el repositorio: (Si estás usando Git)
Bash

git clone <https://github.com/AgusOlbii/My-Ecommerce.git>
cd <TU_CARPETA_DE_PROYECTO>/Frontend
Asegúrate de que el Backend esté Corriendo: Este frontend espera que el backend esté operativo y accesible en http://127.0.0.1:5000 (o el puerto que hayas configurado). Si no lo está, inícialo primero.
Abre index.html en tu Navegador: Simplemente abre el archivo index.html directamente en tu navegador web.
Para un desarrollo más robusto, puedes usar una extensión como "Live Server" en VS Code o un servidor web local simple (python3 -m http.server).
Interacción con el Backend
El frontend se comunica con el backend a través de la API RESTful. Todas las operaciones de CRUD de productos, autenticación y gestión de usuarios se realizan mediante peticiones HTTP (GET, POST, PUT, DELETE) a los endpoints del backend.


-----------------------------------------------------------------------



Backend: ---->
Este es el backend de un proyecto de e-commerce, desarrollado con Flask, que gestiona productos y usuarios, incluyendo un robusto sistema de autenticación y autorización basado en roles.

Características Principales
Gestión de Productos (CRUD Completo):

Crear: Añade nuevos productos al catálogo con detalles como imagen, nombre, descripción, precio, stock y categoría.
Leer: Obtiene la lista completa de productos disponibles o consulta los detalles de un producto específico.
Actualizar: Modifica la información de productos existentes (precio, stock, descripción, etc.).
Eliminar: Retira productos del catálogo.
Persistencia: Todos los datos de los productos se almacenan en una base de datos SQLite.
Gestión de Usuarios y Autenticación Segura (CRUD Parcial + Auth):

Registro (Crear): Permite a nuevos usuarios registrarse con nombre, email y contraseña.
Inicio y Cierre de Sesión: Sistema de autenticación de usuarios basado en sesiones.
Roles de Usuario: Implementa roles (cliente, admin, superAdmin) para definir diferentes niveles de acceso y permisos.
Seguridad de Contraseñas: Las contraseñas de los usuarios se almacenan de forma segura utilizando hashing (con werkzeug.security).
Persistencia: Todos los datos de los usuarios se almacenan en una base de datos SQLite.
Autorización Basada en Roles:

Las rutas sensibles del API están protegidas. Solo los usuarios con los roles adecuados (por ejemplo, admin o superAdmin) pueden realizar operaciones como crear, actualizar o eliminar productos, o gestionar otros usuarios.
La modificación de roles de usuario está restringida al superAdmin.
Validaciones de Datos:

Se realizan validaciones esenciales en la entrada de datos para asegurar su integridad (ej., campos obligatorios, tipos de datos correctos, unicidad de emails).
Estructura del Proyecto
.
├── main.py             # Archivo principal de la aplicación Flask
├── extensions.py       # Inicialización diferida de la base de datos (SQLAlchemy)
├── models/
│   ├── __init__.py
│   ├── producto.py     # Modelo de SQLAlchemy para la entidad Producto
│   └── usuario.py      # Modelo de SQLAlchemy para la entidad Usuario (con hashing de contraseña y roles)
└── routes/
    ├── __init__.py
    ├── productos.py    # Funciones API para la gestión de productos
    └── usuario.py      # Funciones API para la gestión de usuarios y autenticación
Tecnologías Utilizadas
Flask: Micro-framework web para Python.
Flask-SQLAlchemy: Extensión para la interacción con bases de datos.
SQLite: Base de datos ligera utilizada para la persistencia de datos.
Flask-CORS: Manejo de políticas de Cross-Origin Resource Sharing.
Werkzeug Security: Para el hashing seguro de contraseñas.
Cómo Ejecutar el Proyecto
Clona el repositorio: (Si estás usando Git)
Bash

git clone <https://github.com/AgusOlbii/My-Ecommerce.git>
cd <TU_CARPETA_DE_PROYECTO>/BackEnd/app
Crea y activa un entorno virtual:
Bash

python3 -m venv venv
source venv/bin/activate  # En Linux/macOS
# venv\Scripts\activate   # En Windows
Instala las dependencias:
Bash

pip install Flask Flask-SQLAlchemy Flask-Cors Werkzeug
Crea el usuario SuperAdmin inicial (opcional, pero recomendado): Accede a la consola de Flask y ejecuta el código para crear un SuperAdmin:
Ejecuta el archivo: create_superAdmin.py


python3 main.py
El servidor se iniciará en http://127.0.0.1:5000/.
Endpoints del API (Ejemplos)
Aquí hay algunos de los endpoints clave que este backend proporciona:

Productos
GET /productos: Obtener todos los productos.
POST /productos/crear: Crear un nuevo producto (requiere rol admin o superAdmin).
PUT /productos/actualizar/<id>: Actualizar un producto por ID (requiere rol admin o superAdmin).
DELETE /productos/<id>: Eliminar un producto por ID (requiere rol admin o superAdmin).
Usuarios
POST /usuarios/crear: Registrar un nuevo usuario.
POST /usuarios/login: Iniciar sesión.
GET /usuarios/actual: Obtener detalles del usuario logueado (requiere autenticación).
POST /usuarios/logout: Cerrar sesión (requiere autenticación).
GET /usuarios: Obtener todos los usuarios (requiere rol admin o superAdmin).
PUT /usuarios/rol: Modificar el rol de un usuario (requiere rol superAdmin).
Aclaracion: Actualmetne 23/06/25 falta la conexion con la BD
