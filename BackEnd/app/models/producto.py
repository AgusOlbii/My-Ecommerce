class Producto:
    _id_counter = 1

    def __init__(self, imagen, nombre, descripcion, precio, stock, destacado=False):
        self.id = Producto._id_counter
        Producto._id_counter += 1
        self.imagen = imagen
        self.nombre = nombre
        self.descripcion = descripcion
        self.precio = precio
        self.stock = stock
        self.destacado = destacado

    def to_dict(self):
        return {
            "id": self.id,
            "imagen": f"{self.imagen}",
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "precio": self.precio,
            "stock": self.stock,
            "destacado": self.destacado
        }
