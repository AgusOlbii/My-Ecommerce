import { eliminarProducto, actualizarProducto } from "./products.js";
const API_URL = "http://127.0.0.1:5000";
// CREO UNA ALERTA PERSONALIZADA
const alerta = document.createElement("div");
alerta.textContent = "";
alerta.style.position = "fixed";
alerta.style.top = "50%";
alerta.style.left = "50%";
alerta.style.transform = "translate(-50%, -50%)";
alerta.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
alerta.style.color = "white";
alerta.style.padding = "20px 30px";
alerta.style.borderRadius = "10px";
alerta.style.zIndex = "9999";
alerta.style.fontSize = "18px";
alerta.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";

// Agregar un producto a la BASE DE DATOS
const form_agregar = document.getElementById("formAgregarProducto");
if (form_agregar) {
  form_agregar.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Capturar valores del formulario
    const nombre = document.getElementById("agregar-nombre").value.trim();
    const precio = parseFloat(document.getElementById("agregar-precio").value);
    const categoria = document.getElementById("agregar-categoria").value.trim();
    const descripcion = document
      .getElementById("agregar-descripcion")
      .value.trim();
    const imagen = document.getElementById("agregar-imagen").value.trim();
    const destacado = document.getElementById("agregar-destacado").checked;

    // Armar el objeto a enviar
    const nuevoProducto = {
      nombre,
      precio,
      categoria,
      descripcion,
      imagen,
      destacado,
    };
    try {
      const response = await fetch("http://127.0.0.1:5000/productos/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoProducto),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(
          "Error al agregar producto: " +
            (errorData.error || "Error desconocido")
        );
        return;
      }

      // Éxito: limpio formulario y muestro mensaje
      form_agregar.reset();
      const msg = document.getElementById("aviso-agregar");
      msg.style.display = "block";
      msg.innerHTML = `<h2 class="producto-encontrado">¡Producto Agregado!</h2>`;
      msg.classList.add("visible");

      setTimeout(() => {
        msg.classList.remove("visible");
        setTimeout(() => {
          msg.style.display = "none";
        }, 500);
      }, 3000);
    } catch (error) {
      console.error("Error en fetch:", error);
      alert("Error en la conexión o en el servidor.");
    }
  });
}
//   Eliminar un producto de la BASE DE DATOS (EN ESTE CASO LOCALSTORAGE) VERIFIANDO SI EXISTE EL ID
const form_eliminar = document.getElementById("formEliminarProducto");
form_eliminar.addEventListener("submit", async function (event) {
  event.preventDefault();
  const id = document.getElementById("eliminar-producto").value.trim();

  const eliminado = await eliminarProducto(id);

  if (eliminado) {
    form_eliminar.reset();
    const msg = document.getElementById("aviso-eliminar");
    msg.style.display = "block";
    msg.innerHTML = "<h2> ¡Producto eliminado con éxito!</h2>";
    msg.classList.add("visible");
    // Después de unos segundos lo ocultamos suavemente
    setTimeout(() => {
      msg.classList.remove("visible");
      // Y después de la transición, lo ocultamos completamente
      setTimeout(() => {
        msg.style.display = "none";
      }, 500); // debe coincidir con el tiempo de transición
    }, 3000); // Mostrado por 3 segundos
  } else {
    const msg = document.getElementById("aviso-eliminar");
    msg.style.display = "block";
    msg.innerHTML = "<h2> ¡Producto eliminado sin éxito!</h2>";
    msg.classList.add("visible");
    setTimeout(() => {
      msg.classList.remove("visible");
      // Y después de la transición, lo ocultamos completamente
      setTimeout(() => {
        msg.style.display = "none";
      }, 500); // debe coincidir con el tiempo de transición
    }, 3000);
  }
});

//   ACTUALIZAR UN PRODUCTO DE LA BASE DE DATOS (EN ESTE CASO LOCALSTORAGE) BUSCANDOLO POR ID Y VERIFICANDO SI EXISTE
const form_actualizar = document.getElementById("formActualizarProducto");
if (form_actualizar) {
  form_actualizar.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevenimos la recarga de la página
    const id = document.getElementById("idProducto").value;
    actualizarProducto(id);
  });
}

//VERIFICAMOS SI EL ADMINISTRADOR ES SUPERADMIN O NO PARA MOSTRAR EL PANEL DE SUPERADMIN
const super_admin = document.getElementById("superAdmin");
const resp = await fetch(`${API_URL}/usuarios/actual`, {
  method: "GET",
  credentials: "include",
});
console.log("Respuesta cruda de /usuarios/actual:", resp);
const usuarioLogueado = await resp.json();

if (usuarioLogueado && usuarioLogueado.usuario.rol === "superAdmin") {
  super_admin.innerHTML = `
      <div class="admin-list-admins">
        <h2>Asignar o eliminar Admins</h2>
        <form id="formAdmins">
          <input type="email" placeholder="Email del usuario" required />
          <select>
            <option value="asignar">Asignar rol de Admin</option>
            <option value="eliminar">Eliminar rol de Admin</option>
          </select>
          <button type="submit">Aplicar</button>
        </form>
      </div>

      <div class="admin-list-users">
        <h2>Eliminar usuarios</h2>
        <form id="formEliminarUsuario">
          <input
            type="email"
            placeholder="Email del usuario a eliminar"
            required
          />
          <button type="submit">Eliminar Usuario</button>
        </form>
      </div>
    `;
}
// ASIGNAR O ELIMINAR ROL DE ADMIN
const response = await fetch("http://127.0.0.1:5000/usuarios", {
  credentials: "include",
});
const users = await response.json();
const formAdmins = document.getElementById("formAdmins");
if (formAdmins) {
  formAdmins.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = this.querySelector("input").value.trim().toLowerCase();
    const accion = this.querySelector("select").value;

    try {
      const response = await fetch(`http://127.0.0.1:5000/usuarios/rol`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          accion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        mostrarAlerta(data.error || "Error al modificar el rol");
        return;
      }

      mostrarAlerta(data.mensaje || "Rol actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      mostrarAlerta("Error de conexión con el servidor.");
    }
  });
}

//ELIMINAR USUARIOS
const formEliminarUsuario = document.getElementById("formEliminarUsuario");
if (formEliminarUsuario) {
  formEliminarUsuario.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = this.querySelector("input").value.trim().toLowerCase();
    const index = users.findIndex((u) => u.email.toLowerCase() === email);

    if (index === -1) {
      alerta.textContent = "";
      alerta.textContent = "Usuario No encontrado";
      document.body.appendChild(alerta);
      return;
    }

    const eliminado = users.splice(index, 1)[0];
    alerta.textContent = "";
    alerta.textContent = `Usuario ${eliminado.nombre} eliminado correctamente.`;
    document.body.appendChild(alerta);

    localStorage.setItem("usuarios", JSON.stringify(users));
    console.log(users);
  });
}
