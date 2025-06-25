import { mostrarProductos, obtenerProductos } from "./products.js";
import { cargarModal } from "./modal.js";
const API_URL = "http://127.0.0.1:5000";

let productos = await obtenerProductos();
let usuarioLogueado = null;
// --------------------- VERIFICAR USUARIO -------------------------
async function verificarSesionInicial() {
  try {
    const res = await fetch(`${API_URL}/usuarios/actual`, {
      method: "GET", // Es un GET
      credentials: "include", // ¡CRÍTICO para que el navegador envíe la cookie 'session'!
    });

    if (res.ok) {
      const data = await res.json();
      usuarioLogueado = data.usuario;
      cambiarUi(true, usuarioLogueado.rol);
      console.log("Sesión activa detectada al cargar:", usuarioLogueado.nombre);
    } else if (res.status === 401) {
      console.log("No hay sesión activa al cargar la página.");
      usuarioLogueado = null;
      cambiarUi(false);
    } else {
      throw new Error("Error al verificar sesión: " + res.status);
    }
  } catch (error) {
    console.error("Error al verificar sesión inicial:", error);
    usuarioLogueado = null;
    cambiarUi(false);
  } finally {
    // Carga los productos y actualiza la UI una vez que se sabe si hay usuario logueado o no
    productos = await fetch(`${API_URL}/productos`).then((res) => res.json());
    mostrarProductos(productos, usuarioLogueado);
  }
}
let usuarioActual = await verificarSesionInicial();
// --------------------- UI -------------------------
export function cambiarUi(access, rol) {
  const loginBtn = document.getElementById("login");
  if (access) {
    loginBtn.innerHTML = `
      <div class="dropdown-wrapper">
        <i id="dropdownIcon" class="fas fa-user"></i>
        <div id="dropdownMenu" class="dropdown-content-login">
          <a href="#">Perfil</a>
          <a href="#">Configuración</a>
          <a href="#" id="logoutBtn">Cerrar sesión</a>
        </div>
      </div>
    `;

    document.getElementById("dropdownIcon").addEventListener("click", (e) => {
      e.stopPropagation();
      const menu = document.getElementById("dropdownMenu");
      menu.style.display = menu.style.display === "block" ? "none" : "block";
    });

    window.addEventListener("click", () => {
      if (document.getElementById("dropdownMenu")) {
        document.getElementById("dropdownMenu").style.display = "none";
      }
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
      fetch(`${API_URL}/usuarios/logout`, {
        method: "POST",
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error al cerrar sesión");

          usuarioActual = null;

          // 🔄 Volver a renderizar productos como si no hubiese usuario
          cambiarUi(false);
          mostrarProductos(productos, null); // ahora como visitante
          alert("Sesión cerrada correctamente");

          // También podés recargar la página si querés una limpieza total:
          // location.reload();
        })
        .catch((error) => {
          console.error("Error al cerrar sesión:", error);
        });
      console.log("Cerrando sesión...");
    });

    // Mostrar panel admin si el usuario tiene rol admin o superAdmin
    if (rol === "admin" || rol === "superAdmin") {
      const adminLink = document.createElement("a");
      adminLink.href = "../pages/admin.html";
      adminLink.textContent = "Panel de administración";
      document.getElementById("dropdownMenu").appendChild(adminLink);
    }

    console.log("--------CAMBIO DE UI------------");
  } else {
    // Código para mostrar botón de "Iniciar sesión" nuevamente
    loginBtn.innerHTML = `
      <li id="login" class="buttonNav">
            <a id="loginBtn"><i class="fas fa-user"></i></a>
          </li>
    `;
    document.getElementById("loginBtn").addEventListener("click", () => {
      cargarModal("../pages/login.html");
      document.getElementById("modal-container").style.display = "block";
    });
  }
}

// --------------------- LOGIN -------------------------
export function inicializarLogin() {
  const form = document.querySelector(".login-form");

  if (!form) {
    console.warn("Formulario de login no encontrado");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch(`${API_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      alert(`Bienvenido, ${data.usuario.nombre}`);
      usuarioActual = data.usuario;

      cambiarUi(true, data.usuario.rol);
      document.getElementById("modal-container").innerHTML = "";
      mostrarProductos(productos, usuarioLogueado);
    } catch (error) {
      alert(error.message);
      console.log("--------ACCESO DENEGADO------------");
    }
  });
}

// --------------------- REGISTRO -------------------------
export function inicializarRegistro() {
  const form = document.getElementById("register-form");

  if (!form) {
    console.warn("Formulario de registro no encontrado");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("name").value.trim();
    const apellido = document.getElementById("surname").value.trim();
    const telefono = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirm-password")
      .value.trim();

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/usuarios/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: `${nombre} ${apellido}`, // combinamos
          email,
          password,
          telefono,
          rol: "cliente",
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error en el registro");

      alert("¡Registro exitoso!");
    } catch (error) {
      alert(error.message);
    }
  });
}
