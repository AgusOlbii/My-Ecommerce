import { inicializarLogin, inicializarRegistro, cambiarUi } from "./auth.js";

// Mantener UI segun estado del usuario
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Chequeando estado del usuario");
  try {
    const response = await fetch("http://127.0.0.1:5000/usuarios/actual", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    console.log("Respuesta del servidor:", response);
    if (response.ok) {
      const data = await response.json();
      console.log("Sesión activa detectada:", data.usuario);
      cambiarUi(true, data.usuario.rol);
    } else {
      console.log("Sesión no activa");
      cambiarUi(false);
    }
  } catch (error) {
    console.error("Error al verificar sesión:", error);
    cambiarUi(false);
  }
});

export async function cargarModal(rutaHtml) {
  const contenedor = document.getElementById("modal-container");
  const respuesta = await fetch(rutaHtml);
  const html = await respuesta.text();
  contenedor.innerHTML = html;

  // Esperá un frame de renderizado para asegurarte de que el HTML esté en el DOM
  requestAnimationFrame(() => {
    if (rutaHtml.includes("login.html")) {
      inicializarLogin(); // función definida en auth.js
    } else if (rutaHtml.includes("register.html")) {
      inicializarRegistro(); // función definida en auth.js
    }
    const buttonLogin = document.getElementById("buttonLogin");
    const buttonRegister = document.getElementById("buttonRegister");
    const closeBtn = document.getElementById("closeModal");

    console.log("buttonLogin", buttonLogin);
    console.log("buttonRegister", buttonRegister);

    if (buttonLogin) {
      buttonLogin.addEventListener("click", async () => {
        await cargarModal("../pages/login.html");
      });
    }

    if (buttonRegister) {
      buttonRegister.addEventListener("click", async () => {
        await cargarModal("../pages/register.html");
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        contenedor.innerHTML = ""; // Cierra el modal
      });
    }
  });
}
if (document.getElementById("loginBtn")) {
  document.getElementById("loginBtn").addEventListener("click", async () => {
    if (!document.getElementById("modal")) {
      await cargarModal("../pages/login.html");
    }
  });
}
console.log("Modal.js cargado");
