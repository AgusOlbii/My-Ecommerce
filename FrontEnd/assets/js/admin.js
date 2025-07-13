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
alerta.style.display = "none";
document.body.appendChild(alerta);

function mostrarAlerta(mensaje, tipo = "info") {
  alerta.textContent = mensaje;
  alerta.style.backgroundColor =
    tipo === "error" ? "rgba(255, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.8)";
  alerta.style.display = "block";

  setTimeout(() => {
    alerta.style.display = "none";
  }, 3000);
}

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

      if (response.status === 401) {
        mostrarAlerta(
          "Tu sesión ha expirado o no estás autenticado. Redirigiendo al inicio...",
          "error"
        );
        setTimeout(() => {
          window.location.href = "/FrontEnd/pages/index.html";
        }, 2000);
        return;
      }

      if (response.status === 403) {
        mostrarAlerta(
          "No tienes permisos suficientes para agregar productos.",
          "error"
        );
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        mostrarAlerta(
          "Error al agregar producto: " +
            (errorData.error || "Error desconocido"),
          "error"
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
      console.error("Error en fetch para agregar producto:", error);
      mostrarAlerta("Error en la conexión o en el servidor.", "error");
    }
  });
}

// Eliminar un producto de la BASE DE DATOS
const form_eliminar = document.getElementById("formEliminarProducto");
if (form_eliminar) {
  form_eliminar.addEventListener("submit", async function (event) {
    event.preventDefault();
    const id = document.getElementById("eliminar-producto").value.trim();

    try {
      const eliminado = await eliminarProducto(id);

      if (eliminado) {
        form_eliminar.reset();
        const msg = document.getElementById("aviso-eliminar");
        msg.style.display = "block";
        msg.innerHTML = "<h2> ¡Producto eliminado con éxito!</h2>";
        msg.classList.add("visible");
        setTimeout(() => {
          msg.classList.remove("visible");
          setTimeout(() => {
            msg.style.display = "none";
          }, 500);
        }, 3000);
      } else {
        const msg = document.getElementById("aviso-eliminar");
        msg.style.display = "block";
        msg.innerHTML =
          "<h2> ¡Producto no encontrado o error al eliminar!</h2>";
        msg.classList.add("visible");
        setTimeout(() => {
          msg.classList.remove("visible");
          setTimeout(() => {
            msg.style.display = "none";
          }, 500);
        }, 3000);
      }
    } catch (error) {
      console.error("Error en el proceso de eliminación:", error);
      mostrarAlerta(
        "Error en la conexión o en el servidor al eliminar.",
        "error"
      );
    }
  });
}

// ACTUALIZAR UN PRODUCTO DE LA BASE DE DATOS
const form_actualizar = document.getElementById("formActualizarProducto");
if (form_actualizar) {
  form_actualizar.addEventListener("submit", async function (event) {
    event.preventDefault();
    const id = document.getElementById("idProducto").value;

    try {
      const actualizado = await actualizarProducto(id);
      if (actualizado) {
        mostrarAlerta("Producto actualizado con éxito.", "success");
        form_actualizar.reset();
      } else {
        mostrarAlerta("Error al actualizar producto. Verifica el ID.", "error");
      }
    } catch (error) {
      console.error("Error en el proceso de actualización:", error);
      mostrarAlerta(
        "Error en la conexión o en el servidor al actualizar.",
        "error"
      );
    }
  });
}

// VERIFICAMOS SI EL ADMINISTRADOR ES SUPERADMIN O NO PARA MOSTRAR EL PANEL DE SUPERADMIN
const super_admin = document.getElementById("superAdmin");

async function checkAdminStatus() {
  try {
    const resp = await fetch(`${API_URL}/usuarios/actual`, {
      method: "GET",
      credentials: "include",
    });
    console.log("Respuesta cruda de /usuarios/actual:", resp);

    if (resp.status === 401) {
      console.log(
        "Usuario no logueado o sesión expirada, redirigiendo al inicio."
      );
      document.querySelector(".admin-panel").innerHTML =
        '<h2 style="text-align: center; color: red;">No autenticado. Redirigiendo...</h2>';
      setTimeout(() => {
        window.location.href = "/FrontEnd/pages/index.html";
      }, 2000);
      return;
    }

    if (resp.status === 403) {
      console.log("Acceso denegado a admin.html por rol insuficiente.");
      document.querySelector(".admin-panel").innerHTML =
        '<h2 style="text-align: center; color: red;">No tienes permisos para acceder a esta sección.</h2>';
      return;
    }

    if (!resp.ok) {
      const errorData = await resp.json();
      console.error("Error al obtener usuario actual:", errorData.error);
      document.querySelector(".admin-panel").innerHTML =
        '<h2 style="text-align: center; color: red;">Error al cargar el panel de administración.</h2>';
      return;
    }

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
      initSuperAdminForms();
    } else {
      super_admin.innerHTML = "";
    }
  } catch (error) {
    console.error("Error en fetch de /usuarios/actual:", error);
    document.querySelector(".admin-panel").innerHTML =
      '<h2 style="text-align: center; color: red;">Error de conexión. No se pudo cargar el panel.</h2>';
  }
}

document.addEventListener("DOMContentLoaded", checkAdminStatus());

function initSuperAdminForms() {
  const formAdmins = document.getElementById("formAdmins");
  if (formAdmins) {
    formAdmins.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = this.querySelector("input").value.trim().toLowerCase();
      const accion = this.querySelector("select").value;

      try {
        const response = await fetch(`${API_URL}/usuarios/rol`, {
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

        if (response.status === 401) {
          mostrarAlerta(
            "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
            "error"
          );
          setTimeout(() => {
            window.location.href = "/FrontEnd/pages/index.html";
          }, 2000);
          return;
        }

        if (response.status === 403) {
          mostrarAlerta(
            "No tienes permisos para modificar roles de usuario.",
            "error"
          );
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          mostrarAlerta(data.error || "Error al modificar el rol", "error");
          return;
        }

        mostrarAlerta(
          data.mensaje || "Rol actualizado correctamente",
          "success"
        );
      } catch (error) {
        console.error("Error al actualizar rol:", error);
        mostrarAlerta("Error de conexión con el servidor.", "error");
      }
    });
  }

  // ELIMINAR USUARIOS
  const formEliminarUsuario = document.getElementById("formEliminarUsuario");
  if (formEliminarUsuario) {
    formEliminarUsuario.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = this.querySelector("input").value.trim().toLowerCase();

      try {
        const response = await fetch(`${API_URL}/usuarios/eliminar_por_email`, {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        });

        if (response.status === 401) {
          mostrarAlerta(
            "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
            "error"
          );
          setTimeout(() => {
            window.location.href = "/FrontEnd/pages/index.html";
          }, 2000);
          return;
        }

        if (response.status === 403) {
          mostrarAlerta("No tienes permisos para eliminar usuarios.", "error");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          mostrarAlerta(data.error || "Error al eliminar usuario", "error");
          return;
        }

        mostrarAlerta(
          data.mensaje || `Usuario ${email} eliminado correctamente.`,
          "success"
        );
        formEliminarUsuario.reset();
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        mostrarAlerta(
          "Error de conexión con el servidor al eliminar usuario.",
          "error"
        );
      }
    });
  }
}
