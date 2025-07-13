from flask import Flask, request, render_template
from flask_cors import CORS
from flask_migrate import Migrate
from routes.usuario import login_required, role_required
import os

from extensions import db 

app = Flask(__name__)
migrate = Migrate(app, db)
# --- Configuración de la Base de Datos ---
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'mi_ecommerce.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app) 

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

from models.producto import Producto 
from models.usuario import Usuario   
from models.cart import Cart, CartItem

from routes import cart
from routes import productos
from routes import usuario

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
    return usuario.modificar_rol()

@app.route('/usuarios/eliminar_por_email', methods=['PUT'])
@usuario.role_required(['superAdmin'])
def eliminar_usuario():
    return usuario.eliminar_usuario()



# ------------FIN RUTAS PARA USUARIO--------------
# ------------RUTA PARA ADMIN ------------
@app.route('/admin')
@role_required(['admin', 'superAdmin'])
def mostrar_admin_panel():
    return render_template('admin.html')





# ------------RUTAS PARA EL CART--------------
# Obtener productos del carrito del usuario actual
@app.route('/cart', methods=['GET'])
@login_required
def get_cart():
    return cart.get_cart()

# Agregar producto al carrito
@app.route('/cart/add', methods=['POST'])
@login_required
def add_to_cart():
    return cart.add_to_cart()

# Actualizar la cantidad de un item
@app.route('/cart/update/<int:item_id>', methods=['PUT'])
@login_required
def update_cart_item(item_id):
    return cart.update_cart_item(item_id)

# Eliminar un item del carrito
@app.route('/cart/remove/<int:item_id>', methods=['DELETE'])
@login_required
def remove_cart_item(item_id):
    return cart.remove_cart_item(item_id)

# Vaciar carrito completamente
@app.route('/cart/clear', methods=['DELETE'])
@login_required
def clear_cart():
    return cart.clear_cart()

# ------------FIN RUTAS PARA CART--------------




# --- Creación de tablas de la DB al iniciar la app ---
if __name__ == '__main__':
    with app.app_context():
    
        db.create_all()
    print("Tablas creadas exitosamente.")
    app.run(debug=True, port=5000)