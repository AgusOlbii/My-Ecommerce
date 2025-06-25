from flask import jsonify, request, session
from extensions import db # <--- Importa 'db' desde extensions.py
from models.usuario import Usuario, Rol # Importa el modelo Usuario y el Enum Rol
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

# --- Funciones de la API de USUARIO ---

def obtener_usuarios():
    usuarios_db = Usuario.query.all()
    return jsonify([u.to_dict() for u in usuarios_db]), 200

def crear_usuario():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    nombre = data.get('nombre')
    email = data.get('email')
    password = data.get('password')
    rol_str = data.get('rol', 'cliente').lower()

    if not all([nombre, email, password]):
        return jsonify({'error': 'Faltan datos obligatorios'}), 400

    if Usuario.query.filter_by(email=email).first():
        return jsonify({'error': 'El email ya está registrado'}), 400

    try:
        rol_enum = Rol(rol_str)
        current_user_id = session.get('user_id')
        current_user = None
        if current_user_id:
            current_user = db.session.get(Usuario, current_user_id)

        if rol_enum != Rol.CLIENTE:
            if not current_user or current_user.rol.value not in ['admin', 'superAdmin']:
                rol_enum = Rol.CLIENTE
    except ValueError:
        rol_enum = Rol.CLIENTE

    try:
        nuevo_usuario = Usuario(
            nombre=nombre,
            email=email,
            password=password,
            rol=rol_enum
        )
        db.session.add(nuevo_usuario)
        db.session.commit()
        return jsonify({'message': 'Usuario creado exitosamente', 'usuario': nuevo_usuario.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al crear el usuario: {str(e)}"}), 500

def iniciar_sesion():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Faltan credenciales'}), 400

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario or not usuario.check_password(password):
        return jsonify({'error': 'Credenciales inválidas'}), 401

    session.permanent = True
    session['user_id'] = usuario.id
    session['usuario'] = usuario.to_dict()
    print(usuario.to_dict())
    return jsonify({'message': 'Inicio de sesión exitoso', 'usuario': usuario.to_dict()}), 200


def usuario_actual():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'No autenticado'}), 401

    usuario = db.session.get(Usuario, user_id)
    if not usuario:
        session.clear()
        return jsonify({'error': 'Usuario no encontrado o sesión inválida'}), 404

    return jsonify({'usuario': usuario.to_dict()}), 200

def logout():
    session.clear()
    response = jsonify({"message": "Sesión cerrada correctamente"})
    return response

def actualizar_usuario(id):
    current_user_id = session.get('user_id')
    current_user = None
    if current_user_id:
        current_user = db.session.get(Usuario, current_user_id)

    usuario_a_actualizar = db.session.get(Usuario, id)
    if not usuario_a_actualizar:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    if not current_user:
        return jsonify({"error": "No autorizado para actualizar usuarios"}), 401

    if current_user.rol == Rol.SUPERADMIN:
        pass
    elif current_user.rol == Rol.ADMIN:
        if current_user.id != id and usuario_a_actualizar.rol != Rol.CLIENTE:
            return jsonify({"error": "Admin no puede actualizar otros admins o superadmins"}), 403
    elif current_user.rol == Rol.CLIENTE:
        if current_user.id != id:
            return jsonify({"error": "No tienes permiso para actualizar este usuario"}), 403
    else:
        return jsonify({"error": "Permisos insuficientes"}), 403

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No se proporcionaron datos'}), 400

    try:
        if 'nombre' in data and data['nombre'] is not None:
            usuario_a_actualizar.nombre = data['nombre']

        if 'email' in data and data['email'] is not None and data['email'] != usuario_a_actualizar.email:
            if Usuario.query.filter_by(email=data['email']).first():
                return jsonify({'error': 'Email ya registrado por otro usuario'}), 400
            usuario_a_actualizar.email = data['email']

        if 'password' in data and data['password'] is not None:
            usuario_a_actualizar.set_password(data['password'])

        if 'rol' in data and data['rol'] is not None:
            if current_user.rol == Rol.SUPERADMIN:
                try:
                    new_rol = Rol(data['rol'].lower())
                    if usuario_a_actualizar.id == current_user.id and new_rol != Rol.SUPERADMIN:
                         return jsonify({'error': 'Un SuperAdmin no puede degradar su propio rol'}), 403
                    usuario_a_actualizar.rol = new_rol
                except ValueError:
                    return jsonify({'error': 'Rol inválido'}), 400
            else:
                return jsonify({"error": "Solo un SuperAdmin puede modificar roles"}), 403

        db.session.commit()
        return jsonify({'message': 'Usuario actualizado', 'usuario': usuario_a_actualizar.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al actualizar el usuario: {str(e)}"}), 500

def eliminar_usuario(id):
    usuario_a_eliminar = db.session.get(Usuario, id)
    if not usuario_a_eliminar:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    if usuario_a_eliminar.rol == Rol.SUPERADMIN:
        current_user_id = session.get('user_id')
        current_user = db.session.get(Usuario, current_user_id)
        if current_user and current_user.id == id:
             return jsonify({"error": "Un SuperAdmin no puede eliminarse a sí mismo"}), 403
        return jsonify({"error": "No se puede eliminar a otro SuperAdmin"}), 403

    try:
        db.session.delete(usuario_a_eliminar)
        db.session.commit()
        return jsonify({'message': f'Usuario con ID {id} eliminado'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al eliminar el usuario: {str(e)}"}), 500

def modificar_rol():
    data = request.get_json()
    email_target = data.get("email", "").lower()
    accion = data.get("accion")

    if not email_target or not accion:
        return jsonify({"error": "Faltan email o acción"}), 400

    usuario_target = Usuario.query.filter_by(email=email_target).first()

    if not usuario_target:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if usuario_target.rol == Rol.SUPERADMIN:
        return jsonify({"error": "No se puede modificar el rol de otro SuperAdmin"}), 403

    try:
        if accion == "asignar":
            if usuario_target.rol == Rol.ADMIN:
                return jsonify({"mensaje": "El usuario ya es admin"}), 200
            usuario_target.rol = Rol.ADMIN
            mensaje = "Rol de Admin asignado"
        elif accion == "eliminar":
            if usuario_target.rol == Rol.CLIENTE:
                return jsonify({"mensaje": "El usuario no es admin (ya es cliente)"}), 200
            usuario_target.rol = Rol.CLIENTE
            mensaje = "Rol de Admin eliminado (ahora es Cliente)"
        else:
            return jsonify({"error": "Acción no válida"}), 400

        db.session.commit()
        return jsonify({"mensaje": mensaje, "usuario": usuario_target.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al modificar el rol: {str(e)}"}), 500