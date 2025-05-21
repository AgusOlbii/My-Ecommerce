import { inicializarLogin, inicializarRegistro, cambiarUi } from "./auth.js";

// Mantener UI segun estado del usuario
document.addEventListener("DOMContentLoaded", () => {
  const userLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
  console.log("Chequeando estado del ususario");
  if (userLogueado) {
    console.log("Sesion iniciada");
    cambiarUi(true, userLogueado.rol);
  } else {
    console.log("Sesion no iniciada");
    cambiarUi(false);
  }
});

async function cargarModal(rutaHtml) {
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

document.getElementById("loginBtn").addEventListener("click", async () => {
  if (!document.getElementById("modal")) {
    await cargarModal("../pages/login.html");
  }
});
console.log("Modal.js cargado");
