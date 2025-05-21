import { generarId } from "./products.js";

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
});
