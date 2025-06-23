from flask import Flask, request
from flask_cors import CORS
from routes import productos
from routes import usuario

app = Flask(__name__)
app.secret_key = 'una_clave_muy_segura_y_secreta'
CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5500", 
    "http://localhost:5500", 
    "http://127.0.0.1:3000", 
    "http://localhost:3000"])

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
# ------------RUTAS PARA PRODUCTOS --------------
@app.route('/productos', methods=['GET']) #Obtener todos los productos
def get_productos():
    return productos.obtener_productos()

@app.route('/productos/<int:id>', methods=['DELETE']) #Eliminar un producto por ID
def delete_producto(id):
    return productos.eliminar_producto(id)

@app.route('/productos/actualizar/<int:id>', methods=['PUT'])
def update_producto(id):
    return productos.actualizar_producto(id)
@app.route('/productos/crear', methods=['POST']) #Crear un producto
def create_producto():
    return productos.crear_producto()
# ------------RUTAS PARA PRODUCTOS --------------

# ------------RUTAS PARA USUARIO--------------
@app.route('/usuarios', methods=['GET']) #Obtener todos los usuarios
def get_usuarios():
    return usuario.obtener_usuarios()
@app.route('/usuarios/login', methods=['POST']) #INICIAR SESION
def login_usuario():
    return usuario.iniciar_sesion()
@app.route('/usuarios/crear', methods=['POST'])# REGISTRAR UN USUARIO
def create_usuario():
    return usuario.crear_usuario()

@app.route('/usuarios/actual', methods=['GET'])  # Obtener usuario actual
def get_usuario_actual():
    return usuario.usuario_actual()

@app.route('/usuarios/logout', methods=['POST'])  # Cerrar sesión
def logout_usuario():
    return usuario.logout()

@app.route('/usuarios/rol', methods=['PUT'])
def rol_usuario():
    return usuario.modificar_rol



if __name__ == '__main__':
    app.run(debug=True)
