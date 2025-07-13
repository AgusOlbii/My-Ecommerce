from flask import request, jsonify, session
from models.cart import Cart, CartItem
from models.producto import Producto
from extensions import db  # Asegurate de tener db importado

# 1. Obtener el carrito del usuario actual
def get_cart():
    if "usuario" not in session:
        return jsonify({"message": "No autorizado"}), 401

    user_id = session["usuario"]["id"]
    user_cart = Cart.query.filter_by(user_id=user_id).first()

    if not user_cart:
        return jsonify({"items": [], "total_price": 0}), 200

    cart_items_data = []
    total_price = 0

    for item in user_cart.items:
        if item.product:
            item_total = item.product.precio * item.quantity
            total_price += item_total
            cart_items_data.append({
                "item_id": item.id,
                "product_id": item.product.id,
                "nombre": item.product.nombre,
                "precio": item.product.precio,
                "imagen": item.product.imagen,
                "quantity": item.quantity,
                "item_total": item_total
            })

    return jsonify(cart_items_data), 200


# 2. Agregar un producto al carrito
def add_to_cart():
    if "usuario" not in session:
        return jsonify({"message": "No autorizado"}), 401

    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)

    if not product_id:
        return jsonify({"message": "Product ID is required"}), 400
    if not isinstance(quantity, int) or quantity <= 0:
        return jsonify({"message": "Quantity must be a positive integer"}), 400

    product = Producto.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    user_id = session["usuario"]["id"]
    user_cart = Cart.query.filter_by(user_id=user_id).first()
    if not user_cart:
        user_cart = Cart(user_id=user_id)
        db.session.add(user_cart)
        db.session.commit()

    cart_item = CartItem.query.filter_by(cart_id=user_cart.id, product_id=product_id).first()

    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(cart_id=user_cart.id, product_id=product_id, quantity=quantity)
        db.session.add(cart_item)

    db.session.commit()
    return jsonify({"message": "Product added to cart", "cart_item_id": cart_item.id}), 200


# 3. Actualizar la cantidad de un ítem en el carrito
def update_cart_item(item_id):
    if "usuario" not in session:
        return jsonify({"message": "No autorizado"}), 401

    data = request.get_json()
    new_quantity = data.get('quantity')

    if not isinstance(new_quantity, int) or new_quantity <= 0:
        return jsonify({"message": "Quantity must be a positive integer"}), 400

    cart_item = CartItem.query.get(item_id)
    if not cart_item:
        return jsonify({"message": "Cart item not found"}), 404

    user_id = session["usuario"]["id"]
    if cart_item.cart.user_id != user_id:
        return jsonify({"message": "Unauthorized: Item does not belong to this user's cart"}), 403

    cart_item.quantity = new_quantity
    db.session.commit()
    return jsonify({"message": "Cart item quantity updated"}), 200


# 4. Eliminar un ítem del carrito
def remove_cart_item(item_id):
    if "usuario" not in session:
        return jsonify({"message": "No autorizado"}), 401

    cart_item = CartItem.query.get(item_id)
    if not cart_item:
        return jsonify({"message": "Cart item not found"}), 404

    user_id = session["usuario"]["id"]
    if cart_item.cart.user_id != user_id:
        return jsonify({"message": "Unauthorized: Item does not belong to this user's cart"}), 403

    db.session.delete(cart_item)
    db.session.commit()
    return jsonify({"message": "Cart item removed"}), 200


# 5. Vaciar completamente el carrito del usuario
def clear_cart():
    if "usuario" not in session:
        return jsonify({"message": "No autorizado"}), 401

    user_id = session["usuario"]["id"]
    user_cart = Cart.query.filter_by(user_id=user_id).first()

    if not user_cart:
        return jsonify({"message": "Cart is already empty or does not exist"}), 200

    for item in user_cart.items:
        db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Cart cleared successfully"}), 200
