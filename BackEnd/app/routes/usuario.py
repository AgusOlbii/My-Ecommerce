from flask import jsonify, request, session
from models.usuario import Usuario, Rol

# Lista en memoria (simula base de datos)
usuarios = [
    Usuario("Admin Super", "admin@admin.com", "adminpass", Rol.SUPERADMIN),
    Usuario("Cliente 1", "cliente@cliente.com", "cliente", Rol.CLIENTE),
    Usuario("Admin", "admin", 'admin', Rol.ADMIN ),
    Usuario('SuperAdmin', 'admin', 'admin', Rol.SUPERADMIN)
]

# Obtener todos los usuarios
def obtener_usuarios():
    return jsonify([u.to_dict() for u in usuarios])

# Registrar usuario (crear nuevo usuario)
def crear_usuario():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    nombre = data.get('nombre')
    email = data.get('email')
    password = data.get('password')
    rol_str = data.get('rol', 'cliente').lower()

    if not all([nombre, email, password]):
        return jsonify({'error': 'Faltan datos'}), 400

    # Validar rol
    try:
        rol = Rol(rol_str)
    except ValueError:
        rol = Rol.CLIENTE  # default si viene mal el rol

    # Validar email único (simple)
    if any(u.email == email for u in usuarios):
        return jsonify({'error': 'Email ya registrado'}), 400

    nuevo_usuario = Usuario(nombre, email, password, rol)
    usuarios.append(nuevo_usuario)

    return jsonify({'message': 'Usuario creado', 'usuario': nuevo_usuario.to_dict()}), 201

# Iniciar sesion (login)
def iniciar_sesion():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Faltan datos'}), 400

    usuario = next((u for u in usuarios if u.email == email and u.password == password), None)
    if not usuario:
        return jsonify({'error': 'Credenciales inválidas'}), 401

    # Guardar usuario en sesión (puede ser el dict o solo el id)
    session.permanent = True
    session['usuario'] = usuario.to_dict()
    
    return jsonify({'message': 'Inicio de sesión exitoso', 'usuario': usuario.to_dict()}), 200
# Actualizar usuario (por id)
def actualizar_usuario(id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    usuario = next((u for u in usuarios if u.id == id), None)
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    if 'nombre' in data and data['nombre'] is not None:
        usuario.nombre = data['nombre']

    if 'email' in data and data['email'] is not None:
        # Validar que no exista otro usuario con ese email
        if any(u.email == data['email'] and u.id != id for u in usuarios):
            return jsonify({'error': 'Email ya registrado por otro usuario'}), 400
        usuario.email = data['email']

    if 'password' in data and data['password'] is not None:
        usuario.password = data['password']  # En producción, hashear

    if 'rol' in data and data['rol'] is not None:
        try:
            nuevo_rol = Rol(data['rol'].lower())
            # Restricción para que un SUPERADMIN no se cambie a sí mismo
            if usuario.rol == Rol.SUPERADMIN:
                return jsonify({'error': 'Un SUPERADMIN no puede cambiar su propio rol'}), 403
            usuario.rol = nuevo_rol
        except ValueError:
            return jsonify({'error': 'Rol inválido'}), 400

    return jsonify({'message': 'Usuario actualizado', 'usuario': usuario.to_dict()}), 200

# Eliminar usuario (por id)
def eliminar_usuario(id):

    global usuarios
    usuario = next((u for u in usuarios if u.id == id), None)
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    usuarios = [u for u in usuarios if u.id != id]
    return jsonify({'message': f'Usuario con ID {id} eliminado'}), 200

# Obtener usuario actual desde la sesión
def usuario_actual():
    if 'usuario' in session:
        return jsonify({'usuario': session['usuario']}), 200
    return jsonify({'error': 'No autenticado'}), 401

# Cerrar sesión (logout)
def logout():
    session.clear()
    response = jsonify({"message": "Sesión cerrada correctamente"})
    response.set_cookie('session', '', expires=0)
    return response
#CAMBIAR ROL DE UN USUARIO
def modificar_rol():
    # 1. SE VERIFICA LA EXISTENCIA DE UN USUARIO LOGUEADO
    usuario_actual = session.get("usuario")
    if not usuario_actual:
        return jsonify({"error": "No autorizado"}), 401

    # 2. SE VERIFICA SI EL USUARIO LOGUEADO TIENE ROL DE SUPERADMIN PARA ACCEDER.
    if usuario_actual.get("rol") != "superAdmin":
        return jsonify({"error": "Permisos insuficientes"}), 403

    data = request.get_json()
    email = data.get("email", "").lower()
    accion = data.get("accion")

    usuario = next((u for u in usuarios if u["email"].lower() == email), None)

    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if accion == "asignar":
        if usuario["rol"] == "admin":
            return jsonify({"mensaje": "El usuario ya es admin"}), 200
        usuario["rol"] = "admin"
        return jsonify({"mensaje": "Rol de Admin asignado"}), 200

    elif accion == "eliminar":
        if usuario["rol"] == "admin":
            usuario["rol"] = "user"
            return jsonify({"mensaje": "Rol de Admin eliminado"}), 200
        else:
            return jsonify({"mensaje": "El usuario no es admin"}), 200

    return jsonify({"error": "Acción no válida"}), 400

