from enum import Enum

class Rol(Enum):
    CLIENTE = "cliente"
    ADMIN = "admin"
    SUPERADMIN = "superadmin"

class Usuario:
    _id_counter = 1

    def __init__(self, nombre, email, password, rol=Rol.CLIENTE):
        self.id = Usuario._id_counter
        Usuario._id_counter += 1
        self.nombre = nombre
        self.email = email
        self.password = password  # En producción debería estar hasheado
        self.rol = rol

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email,
            "rol": self.rol.value
        }
