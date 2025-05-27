import { generarId } from "./products.js";
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

// Agregar un producto a la BASE DE DATOS (EN ESTE CASO LOCALSTORAGE)
document.addEventListener("DOMContentLoaded", function () {
  const form_agregar = document.getElementById("formAgregarProducto");
  if (form_agregar) {
    form_agregar.addEventListener("submit", function (event) {
      event.preventDefault();
      const id = generarId();
      const name = document.getElementById("agregar-nombre").value;
      const price = document.getElementById("agregar-precio").value;
      const description = document.getElementById("agregar-descripcion").value;
      const category = document.getElementById("agregar-categoria").value;
      const image = document.getElementById("agregar-imagen");
      const esDestacado = document.getElementById("agregar-destacado").checked;

      const productos = JSON.parse(localStorage.getItem("productos")) || [];
      const nuevoProducto = {
        id: id,
        nombre: name,
        precio: price,
        descripcion: description,
        categoria: category,
        imagen: image,
        destacado: esDestacado,
      };
      // Add the new product to the array
      productos.push(nuevoProducto);
      // Save the updated array back to localStorage
      localStorage.setItem("productos", JSON.stringify(productos));
      // Clear the form fields
      form_agregar.reset();
      // Optionally, you can display a success message or update the UI

      const msg = document.getElementById("aviso-agregar");
      msg.style.display = "block";
      msg.innerHTML = `
        <h2 class="producto-encontrado">¡Producto Agregado!</h2>
        `;
      msg.classList.add("visible");

      // Si estaba oculto antes, lo mostramos con transición
      msg.style.display = "block";

      // Después de unos segundos lo ocultamos suavemente
      setTimeout(() => {
        msg.classList.remove("visible");

        // Y después de la transición, lo ocultamos completamente
        setTimeout(() => {
          msg.style.display = "none";
        }, 500); // debe coincidir con el tiempo de transición
      }, 3000); // Mostrado por 3 segundos
    });
  }

  //   Eliminar un producto de la BASE DE DATOS (EN ESTE CASO LOCALSTORAGE) VERIFIANDO SI EXISTE EL ID
  const form_eliminar = document.getElementById("formEliminarProducto");
  if (form_eliminar) {
    form_eliminar.addEventListener("submit", function (event) {
      event.preventDefault();
      const productos = JSON.parse(localStorage.getItem("productos")) || [];
      const id = Number(document.getElementById("eliminar-producto").value);

      const productoExiste = productos.some((p) => Number(p.id) === id);
      console.log(productos);

      if (!productoExiste) {
        const msg = document.getElementById("aviso-eliminar");
        msg.style.display = "block";
        msg.innerHTML = `
        <h2 class="producto-no-encontrado">¡Producto no encontrado!</h2>
        `;
        msg.classList.add("visible");

        // Si estaba oculto antes, lo mostramos con transición
        msg.style.display = "block";

        // Después de unos segundos lo ocultamos suavemente
        setTimeout(() => {
          msg.classList.remove("visible");

          // Y después de la transición, lo ocultamos completamente
          setTimeout(() => {
            msg.style.display = "none";
          }, 500); // debe coincidir con el tiempo de transición
        }, 3000); // Mostrado por 3 segundos
        return;
      } else {
        const nuevoArray = productos.filter((p) => Number(p.id) !== id);
        localStorage.setItem("productos", JSON.stringify(nuevoArray));
        form_eliminar.reset();

        // MOSTRAMOS UN CARTEL QUE NOS INFORMA QUE SE HA ACTUALIZADO EXITOSAMENTE
        const msg = document.getElementById("aviso-eliminar");
        msg.style.display = "block";
        msg.innerHTML = `
        <h2 class="producto-encontrado">¡Eliminado con exito!</h2>
        `;
        msg.classList.add("visible");

        // Si estaba oculto antes, lo mostramos con transición
        msg.style.display = "block";

        // Después de unos segundos lo ocultamos suavemente
        setTimeout(() => {
          msg.classList.remove("visible");

          // Y después de la transición, lo ocultamos completamente
          setTimeout(() => {
            msg.style.display = "none";
          }, 500); // debe coincidir con el tiempo de transición
        }, 3000); // Mostrado por 3 segundos
      }
    });
  }

  //   ACTUALIZAR UN PRODUCTO DE LA BASE DE DATOS (EN ESTE CASO LOCALSTORAGE) BUSCANDOLO POR ID Y VERIFICANDO SI EXISTE
  const form_actualizar = document.getElementById("formActualizarProducto");
  if (form_actualizar) {
    form_actualizar.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevenimos la recarga de la página

      const productos = JSON.parse(localStorage.getItem("productos")) || [];
      console.log(productos);
      // Obtenemos el ID ingresado por el usuario y lo convertimos a número
      const idProducto = Number(document.getElementById("idProducto").value);

      // Buscamos el producto en el array
      const producto = productos.find((p) => Number(p.id) === idProducto);

      if (!producto) {
        const msg = document.getElementById("aviso-actualizar");
        msg.style.display = "block";
        msg.innerHTML = `
        <h2 class="producto-no-encontrado">¡Producto no encontrado!</h2>
        `;
        msg.classList.add("visible");

        // Si estaba oculto antes, lo mostramos con transición
        msg.style.display = "block";

        // Después de unos segundos lo ocultamos suavemente
        setTimeout(() => {
          msg.classList.remove("visible");

          // Y después de la transición, lo ocultamos completamente
          setTimeout(() => {
            msg.style.display = "none";
          }, 500); // debe coincidir con el tiempo de transición
        }, 3000); // Mostrado por 3 segundos
        return;
      } else {
        // Obtenemos los valores del formulario
        const nuevoNombre = document
          .getElementById("nombreActualizado")
          .value.trim();
        const nuevoPrecio = document
          .getElementById("precioActualizado")
          .value.trim();
        const nuevaCategoria = document
          .getElementById("categoriaActualizada")
          .value.trim();
        const nuevaDescripcion = document
          .getElementById("descripcionActualizada")
          .value.trim();
        const nuevaImagen = document
          .getElementById("imagenActualizada")
          .value.trim();
        const nuevoDestacado = document.getElementById(
          "destacadoActualizado"
        ).checked;

        // Solo actualizamos los campos que no estén vacíos
        if (nuevoNombre) producto.nombre = nuevoNombre;
        if (nuevoPrecio) producto.precio = nuevoPrecio;
        if (nuevaCategoria) producto.categories = [nuevaCategoria];
        if (nuevaDescripcion) producto.descripcion = nuevaDescripcion;
        if (nuevaImagen) producto.imagen = nuevaImagen;

        // Este sí se actualiza siempre (aunque sea false)
        producto.destacado = nuevoDestacado;

        // Guardamos los cambios
        localStorage.setItem("productos", JSON.stringify(productos));

        // MOSTRAMOS UN CARTEL QUE NOS INFORMA QUE SE HA ACTUALIZADO EXITOSAMENTE
        const msg = document.getElementById("aviso-actualizar");
        msg.style.display = "block";
        msg.innerHTML = `
        <h2 class="producto-encontrado">¡Actualizado con exito!</h2>
        `;
        msg.classList.add("visible");

        // Si estaba oculto antes, lo mostramos con transición
        msg.style.display = "block";

        // Después de unos segundos lo ocultamos suavemente
        setTimeout(() => {
          msg.classList.remove("visible");

          // Y después de la transición, lo ocultamos completamente
          setTimeout(() => {
            msg.style.display = "none";
          }, 500); // debe coincidir con el tiempo de transición
        }, 3000); // Mostrado por 3 segundos
      }
    });
  }

  //VERIFICAMOS SI EL ADMINISTRADOR ES SUPERADMIN O NO PARA MOSTRAR EL PANEL DE SUPERADMIN
  const super_admin = document.getElementById("superAdmin");
  const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
  if (usuarioLogueado && usuarioLogueado.rol === "superAdmin") {
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
  let users = JSON.parse(localStorage.getItem("usuarios"));
  const formAdmins = document.getElementById("formAdmins");
  if (formAdmins) {
    formAdmins.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = this.querySelector("input").value.trim().toLowerCase();
      const accion = this.querySelector("select").value;

      const usuario = users.find((u) => u.email.toLowerCase() === email);

      if (!usuario) {
        alerta.textContent = "";
        alerta.textContent = "Usuario No encontrado";
        document.body.appendChild(alerta);
        return;
      }

      if (accion === "asignar") {
        if (usuario.rol === "admin") {
          alerta.textContent = "";
          alerta.textContent = "El usuario ya es Admin";
          document.body.appendChild(alerta);
        } else {
          usuario.rol = "admin";
          alerta.textContent = "";
          alerta.textContent = "Rol de Admin asignado";
          document.body.appendChild(alerta);
        }
      } else if (accion === "eliminar") {
        if (usuario.rol === "admin") {
          usuario.rol = "user";
          alerta.textContent = "";
          alerta.textContent = "Rol de admin eliminado";
          document.body.appendChild(alerta);
        } else {
          alerta.textContent = "";
          alerta.textContent = "El usuario no es admin";
          document.body.appendChild(alerta);
        }
      }

      localStorage.setItem("usuarios", JSON.stringify(users));
      console.log(users);
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
});
