from flask import jsonify, request, session
from extensions import db # <--- Importa 'db' desde extensions.py
from models.producto import Producto
from models.usuario import Usuario # Necesitamos Usuario para el decorador de rol
from functools import wraps

# --- Decoradores de rol (Mover a un archivo utils/auth_decorators.py para ser DRY) ---
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "No autenticado"}), 401
        return f(*args, **kwargs)
    return decorated_function

def role_required(roles):
    def decorator(f):
        @wraps(f)
        @login_required
        def decorated_function(*args, **kwargs):
            user_id = session.get('user_id')
            usuario_actual = db.session.get(Usuario, user_id)

            if not usuario_actual or usuario_actual.rol.value not in roles:
                 return jsonify({"error": "Acceso denegado: rol insuficiente"}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator
# --- FIN de Decoradores de rol ---

# --- Funciones de la API de Productos ---

def obtener_productos():
    productos_db = Producto.query.all()
    return jsonify([p.to_dict() for p in productos_db]), 200

def crear_producto():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No se proporcionaron datos'}), 400

    required_fields = ['nombre', 'precio', 'descripcion', 'imagen']
    for field in required_fields:
        if field not in data or data[field] is None:
            return jsonify({'error': f"Falta el campo requerido: {field}"}), 400

    try:
        nuevo_producto = Producto(
            nombre=data['nombre'],
            precio=float(data['precio']),
            descripcion=data['descripcion'],
            imagen=data['imagen'],
            # stock=int(data['stock']),
            categoria=data.get('categoria'),
            destacado=data.get('destacado', False)
        )
        db.session.add(nuevo_producto)
        db.session.commit()
        return jsonify({"mensaje": "Producto creado exitosamente", "producto": nuevo_producto.to_dict()}), 201
    except ValueError:
        db.session.rollback()
        return jsonify({"error": "Tipo de dato inválido para precio o stock"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error interno al crear el producto: {str(e)}"}), 500

def eliminar_producto(id):
    producto_a_eliminar = db.session.get(Producto, id)

    if not producto_a_eliminar:
        return jsonify({"error": "Producto no encontrado"}), 404

    try:
        db.session.delete(producto_a_eliminar)
        db.session.commit()
        return jsonify({"mensaje": f"Producto con ID {id} eliminado"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al eliminar el producto: {str(e)}"}), 500

def actualizar_producto(id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No se proporcionaron datos'}), 400

    producto_a_actualizar = db.session.get(Producto, id)
    if not producto_a_actualizar:
        return jsonify({'error': 'Producto no encontrado'}), 404

    try:
        if 'nombre' in data and data['nombre'] is not None:
            producto_a_actualizar.nombre = data['nombre']
        if 'descripcion' in data and data['descripcion'] is not None:
            producto_a_actualizar.descripcion = data['descripcion']
        if 'precio' in data and data['precio'] is not None:
            producto_a_actualizar.precio = float(data['precio'])
        if 'stock' in data and data['stock'] is not None:
            producto_a_actualizar.stock = int(data['stock'])
        if 'imagen' in data and data['imagen'] is not None:
            producto_a_actualizar.imagen = data['imagen']
        if 'destacado' in data and data['destacado'] is not None:
            destacado = data['destacado']
            if isinstance(destacado, str):
                destacado = destacado.lower() in ['true', '1', 'yes']
            producto_a_actualizar.destacado = destacado
        if 'categoria' in data and data['categoria'] is not None:
            producto_a_actualizar.categoria = data['categoria']

        db.session.commit()

        return jsonify({
            'mensaje': 'Producto actualizado',
            'producto': producto_a_actualizar.to_dict()
        }), 200
    except ValueError:
        db.session.rollback()
        return jsonify({"error": "Tipo de dato inválido para precio o stock"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al actualizar el producto: {str(e)}"}), 500