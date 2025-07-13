from datetime import datetime
from extensions import db
class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('producto.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1, nullable=False)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relación uno a uno: Un ítem de carrito se asocia a un producto
    product = db.relationship('Producto', lazy=True)

    def __repr__(self):
        return f'<CartItem {self.id} (Cart {self.cart_id}, Producto {self.product_id}, Qty {self.quantity})>'
    
class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), unique=True, nullable=False) # Un carrito por usuario
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relación uno a muchos: Un carrito tiene muchos ítems
    items = db.relationship('CartItem', backref='cart', lazy=True, cascade="all, delete-orphan") # 'cascade' para eliminar ítems si el carrito es eliminado

    def __repr__(self):
        return f'<Cart {self.id} for User {self.user_id}>'
    

