# Importa el objeto 'db' desde extensions.py
from extensions  import db
from sqlalchemy import Enum 

class Producto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    imagen = db.Column(db.String(255), nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    precio = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, default=0, nullable=False)
    destacado = db.Column(db.Boolean, default=False, nullable=False)
    categoria = db.Column(db.String(50), nullable=True)

    def __init__(self, imagen, nombre, descripcion, precio, stock= 0, categoria=None, destacado=False):
        self.imagen = imagen
        self.nombre = nombre
        self.descripcion = descripcion
        self.precio = precio
        self.stock = stock
        self.categoria = categoria
        self.destacado = destacado

    def __repr__(self):
        return f'<Producto {self.id}: {self.nombre}>'

    def to_dict(self):
        return {
            "id": self.id,
            "imagen": self.imagen,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "precio": self.precio,
            "stock": self.stock,
            "destacado": self.destacado,
            "categoria": self.categoria
        }