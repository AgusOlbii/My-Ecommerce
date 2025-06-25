from enum import Enum
# Importa el objeto 'db' desde extensions.py
from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class Rol(Enum):
    CLIENTE = "cliente"
    ADMIN = "admin"
    SUPERADMIN = "superAdmin"

class Usuario(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    rol = db.Column(db.Enum(Rol), default=Rol.CLIENTE, nullable=False)

    def __init__(self, nombre, email, password, rol=Rol.CLIENTE):
        self.nombre = nombre
        self.email = email
        self.set_password(password)
        self.rol = rol

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<Usuario {self.id}: {self.email}>'

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email,
            "rol": self.rol.value
        }