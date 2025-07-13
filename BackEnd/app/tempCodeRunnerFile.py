from main import app, db
from models.usuario import Usuario, Rol
import sys

SUPER_ADMIN_EMAIL = "admin@admin.com"
SUPER_ADMIN_PASSWORD = "adminpass"  # ¡CAMBIALO!
SUPER_ADMIN_NOMBRE = "Administrador Principal"

def create_initial_superadmin():
    with app.app_context():
        print("Verificando usuario SuperAdmin...")
        existing_admin = Usuario.query.filter_by(email=SUPER_ADMIN_EMAIL).first()

        if not existing_admin:
            try:
                new_super_admin = Usuario(
                    nombre=SUPER_ADMIN_NOMBRE,
                    email=SUPER_ADMIN_EMAIL,
                    password=SUPER_ADMIN_PASSWORD,
                    rol=Rol.SUPERADMIN  # <- Enum en mayúsculas
                )
                db.session.add(new_super_admin)
                db.session.commit()
                print(f"Usuario SuperAdmin '{SUPER_ADMIN_EMAIL}' creado exitosamente.")
            except Exception as e:
                db.session.rollback()
                print(f"Error al crear el usuario SuperAdmin: {e}", file=sys.stderr)
        else:
            print(f"El usuario SuperAdmin '{SUPER_ADMIN_EMAIL}' ya existe en la base de datos.")

        print("\nUsuarios actuales en la base de datos:")
        all_users = Usuario.query.all()
        if not all_users:
            print("No hay usuarios en la base de datos.")
        for user in all_users:
            print(f"ID: {user.id}, Nombre: {user.nombre}, Email: {user.email}, Rol: {user.rol.value}")

if __name__ == '__main__':
    create_initial_superadmin()
