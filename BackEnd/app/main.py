from flask import Flask, request
from flask_cors import CORS
import os

from extensions import db # <--- Importa db desde extensions.py

# NO importes las rutas aquí todavía. Las importaremos después.
# from routes import productos
# from routes import usuario

app = Flask(__name__)

# --- Configuración de la Base de Datos ---
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'mi_ecommerce.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app) # <--- Inicializa db con la instancia de app aquí

# --- Fin de Configuración de la Base de Datos ---

app.secret_key = 'una_clave_muy_segura_y_secreta'
CORS(app, supports_credentials=True, origins=[
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://127.0.0.1:3000",
    "http://localhost:3000"
])

# Rutas
@app.before_request
def handle_options():
    if request.method == 'OPTIONS':
        response = app.make_response('')
        response.headers.add("Access-Control-Allow-Origin", request.headers.get("Origin"))
        response.headers.add("Access-Control-Allow-Credentials", "true")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        return response

# Ahora importa tus modelos y rutas *después* de que 'db' ha sido inicializado con 'app'.
# La importación de modelos DEBE ir antes que las rutas si las rutas los necesitan.
from models.producto import Producto # Importa el modelo
from models.usuario import Usuario   # Importa el modelo

from routes import productos # <--- Ahora se pueden importar de forma segura
from routes import usuario   # <--- Ahora se pueden importar de forma segura

# ------------RUTAS PARA PRODUCTOS --------------
@app.route('/productos', methods=['GET'])
def get_productos():
    return productos.obtener_productos()

@app.route('/productos/<int:id>', methods=['DELETE'])
@productos.role_required(['admin', 'superAdmin'])
def delete_producto(id):
    return productos.eliminar_producto(id)

@app.route('/productos/actualizar/<int:id>', methods=['PUT'])
@productos.role_required(['admin', 'superAdmin'])
def update_producto(id):
    return productos.actualizar_producto(id)

@app.route('/productos/crear', methods=['POST'])
@productos.role_required(['admin', 'superAdmin'])
def create_producto():
    return productos.crear_producto()
# ------------FIN RUTAS PARA PRODUCTOS --------------

# ------------RUTAS PARA USUARIO --------------
@app.route('/usuarios', methods=['GET'])
@usuario.role_required(['admin', 'superAdmin'])
def get_usuarios():
    return usuario.obtener_usuarios()

@app.route('/usuarios/login', methods=['POST'])
def login_usuario():
    return usuario.iniciar_sesion()

@app.route('/usuarios/crear', methods=['POST'])
def create_usuario():
    return usuario.crear_usuario()

@app.route('/usuarios/actual', methods=['GET'])
@usuario.login_required
def get_usuario_actual():
    return usuario.usuario_actual()

@app.route('/usuarios/logout', methods=['POST'])
@usuario.login_required
def logout_usuario():
    return usuario.logout()

@app.route('/usuarios/rol', methods=['PUT'])
@usuario.role_required(['superAdmin'])
def rol_usuario():
    return usuario.modificar_rol
# ------------FIN RUTAS PARA USUARIO--------------

# --- Creación de tablas de la DB al iniciar la app ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Esto crea las tablas definidas en tus modelos (Producto, Usuario)
    app.run(debug=True)