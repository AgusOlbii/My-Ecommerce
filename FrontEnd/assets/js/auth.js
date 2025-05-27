const users = [
  {
    nombre: "Agustin",
    apellido: "Olbinsky",
    email: "agustinolbinsky@gmail.com",
    telefono: "3412006055",
    password: "123456",
    rol: "admin",
  },
  {
    nombre: "Ignacio",
    apellido: "Bastianelli",
    email: "tuzorrita@gmail.com",
    telefono: "341789239",
    password: "tuputita",
    rol: "user",
  },
  {
    nombre: "Leo",
    apellido: "Messi",
    email: "m@g.com",
    telefono: "341789239",
    password: "messi",
    rol: "superAdmin",
  },
];
localStorage.setItem("usuarios", JSON.stringify(users));
// Funcion para cambiar la UI al iniciar sesion agregando un dropdown con opciones de perfil, configuracion y cerrar sesion
export function cambiarUi(access, admin) {
  if (access) {
    const loginBtn = document.getElementById("login");
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

    // Cerrar el menú si se hace clic afuera
    window.addEventListener("click", () => {
      document.getElementById("dropdownMenu").style.display = "none";
    });
    // Cerrar Sesion con local storage
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("usuarioLogueado");
      location.reload(); // o redirigí a otra página
    });
    console.log("--------CAMBIO DE UI------------");
  }
  if (admin) {
    const dropdownMenu = document.getElementById("dropdownMenu");
    const adminLink = document.createElement("a");
    adminLink.href = "../pages/admin.html";
    adminLink.textContent = "Panel de administración";
    dropdownMenu.appendChild(adminLink);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const userLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

  if (userLogueado) {
    cambiarUi(true, userLogueado.rol);
  } else {
    cambiarUi(false);
  }
});

export function inicializarLogin() {
  let access = false;
  let admin = false;
  const form = document.querySelector(".login-form");

  if (!form) {
    console.warn("Formulario de login no encontrado");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();

    const user = users.find(
      (u) => u.email.toLowerCase() === email && u.password === password
    );
    // Guardar en localStorage
    localStorage.setItem("usuarioLogueado", JSON.stringify(user));

    if (user) {
      alert(`Bienvenido, ${user.nombre}!`);
      console.log("--------ACCESO CORRECTO------------");
      if (user.rol === "admin" || user.rol === "superAdmin") {
        admin = true;
      }
      access = true;
      cambiarUi(access, admin);
      const modal = document.getElementById("modal-container");
      modal.innerHTML = "";
    } else {
      console.log("--------ACCESO DENEGADO------------");
      alert("Email o contraseña incorrectos.");
    }
  });
}

export function inicializarRegistro() {
  const form = document.getElementById("register-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    console.log("Formulario de registro enviado");

    const email = document.getElementById("email").value.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === email);
    if (user) {
      alert("El email ya está registrado.");
    } else {
      const nombre = document.getElementById("name").value.trim();
      const apellido = document.getElementById("surname").value.trim();
      const telefono = document.getElementById("phone").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document
        .getElementById("confirm-password")
        .value.trim();
      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
      }
      const nuevoUsuario = {
        nombre,
        apellido,
        email,
        telefono,
        password,
        rol: "user",
      };
      users.push(nuevoUsuario);
      alert("Registro exitoso!");
      console.log(users);
      localStorage.setItem("usuarios", JSON.stringify(users));
    }
  });
  console.log(users);
}
