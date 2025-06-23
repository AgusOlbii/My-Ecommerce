from flask import jsonify, request, session
from models.producto import Producto

# Lista en memoria (puede ir luego en una capa de servicio)
productos = [
    Producto("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7vX91jiSEPOlx8GpTS2Y_OzrEn0Zv5UTeJIbzwS4U46nVOo5Ug-UEmqSlwLhDttlGj8o&usqp=CAU", "Producto 1", "Descripción del producto 1", 100, 10, True),
    Producto("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7vX91jiSEPOlx8GpTS2Y_OzrEn0Zv5UTeJIbzwS4U46nVOo5Ug-UEmqSlwLhDttlGj8o&usqp=CAU", "Producto 2", "Descripción del producto 2", 100, 10, False),
    Producto("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7vX91jiSEPOlx8GpTS2Y_OzrEn0Zv5UTeJIbzwS4U46nVOo5Ug-UEmqSlwLhDttlGj8o&usqp=CAU", "Producto 3", "Descripción del producto 3", 100, 10, False),
     Producto("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7vX91jiSEPOlx8GpTS2Y_OzrEn0Zv5UTeJIbzwS4U46nVOo5Ug-UEmqSlwLhDttlGj8o&usqp=CAU", "Producto 4", "Descripción del producto 1", 100, 10, True),
    Producto("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7vX91jiSEPOlx8GpTS2Y_OzrEn0Zv5UTeJIbzwS4U46nVOo5Ug-UEmqSlwLhDttlGj8o&usqp=CAU", "Producto 5", "Descripción del producto 2", 100, 10, False),
    Producto("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7vX91jiSEPOlx8GpTS2Y_OzrEn0Zv5UTeJIbzwS4U46nVOo5Ug-UEmqSlwLhDttlGj8o&usqp=CAU", "Producto 6", "Descripción del producto 3", 100, 10, False),
     Producto("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7vX91jiSEPOlx8GpTS2Y_OzrEn0Zv5UTeJIbzwS4U46nVOo5Ug-UEmqSlwLhDttlGj8o&usqp=CAU", "Producto 7", "Descripción del producto 1", 100, 10, True),
    Producto("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7vX91jiSEPOlx8GpTS2Y_OzrEn0Zv5UTeJIbzwS4U46nVOo5Ug-UEmqSlwLhDttlGj8o&usqp=CAU", "Producto 8", "Descripción del producto 2", 100, 10, False),
    Producto("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7vX91jiSEPOlx8GpTS2Y_OzrEn0Zv5UTeJIbzwS4U46nVOo5Ug-UEmqSlwLhDttlGj8o&usqp=CAU", "Producto 9", "Descripción del producto 3", 100, 10, False)
]

def usuario_logueado_con_permiso():
    usuario = session.get("usuario")
    if not usuario:
        return False, jsonify({"error": "No autorizado"}), 401
    if usuario["rol"] not in ["admin", "superAdmin"]:
        return False, jsonify({"error": "Permisos insuficientes"}), 403
    return True, usuario, None

# Obtener PRODUCTOS
def obtener_productos():
    return jsonify([p.to_dict() for p in productos])
# ELIMINAR PRODUCTO
def eliminar_producto(id):
    global productos
    producto = next((p for p in productos if p.id == id), None)
    if not producto:
        return jsonify({"error": "Producto no encontrado"}), 404
    productos = [p for p in productos if p.id != id]
    return jsonify({"mensaje": f"Producto con ID {id} eliminado"}), 200
# ACTUALIZAR PRODUCTO
def actualizar_producto(id):

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    producto = next((p for p in productos if p.id == id), None)
    if not producto:
        return jsonify({'error': 'Producto no encontrado'}), 404

    # Solo actualizamos si la clave existe y el valor no es None
    if 'nombre' in data and data['nombre'] is not None:
        producto.nombre = data['nombre']
    if 'descripcion' in data and data['descripcion'] is not None:
        producto.descripcion = data['descripcion']
    if 'precio' in data and data['precio'] is not None:
        try:
            producto.precio = float(data['precio'])
        except (ValueError, TypeError):
            return jsonify({'error': 'Precio inválido'}), 400
    if 'stock' in data and data['stock'] is not None:
        try:
            producto.stock = int(data['stock'])
        except (ValueError, TypeError):
            return jsonify({'error': 'Stock inválido'}), 400
    if 'imagen' in data and data['imagen'] is not None:
        producto.imagen = data['imagen']
    if 'destacado' in data and data['destacado'] is not None:
        destacado = data['destacado']
        if isinstance(destacado, str):
            destacado = destacado.lower() in ['true', '1', 'yes']
        producto.destacado = destacado

    return jsonify({
        'message': 'Producto actualizado',
        'producto': {
            'id': producto.id,
            'imagen': producto.imagen,
            'nombre': producto.nombre,
            'descripcion': producto.descripcion,
            'precio': producto.precio,
            'stock': producto.stock,
            'destacado': producto.destacado
        }
    }), 200
# CREAR PRODUCTO
def crear_producto():
    print(request.get_data())
    print(request.headers)
    data = request.get_json()
   
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    nombre = data.get('nombre')
    descripcion = data.get('descripcion')
    precio = data.get('precio')
    stock = data.get('stock')
    imagen = data.get('imagen', 'default.jpg')
    destacado = data.get('destacado', False)


    if not all([nombre, descripcion, precio is not None]):
        return jsonify({'error': 'Faltan datos'}), 400
    productos.append(Producto(nombre, descripcion, precio, stock, imagen, destacado))
    return jsonify({'message': 'Producto creado'}), 201
