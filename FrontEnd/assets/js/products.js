// Funcion para generar un ID unico para cada producto
export function generarId() {
  let ultimoId = localStorage.getItem("ultimoIdProducto") || 0;
  ultimoId = Number(ultimoId) + 1;
  localStorage.setItem("ultimoIdProducto", ultimoId);
  return ultimoId;
}

document.addEventListener("DOMContentLoaded", () => {
  const productosGuardados = localStorage.getItem("productos");

  // Solo los guarda si no hay nada en localStorage todavía
  if (!productosGuardados) {
    const productos = [
      {
        id: generarId(),
        nombre: "Producto 1",
        precio: "100",
        imagen: "../assets/img/ropa1.jpeg",
        destacado: true,
        categories: ["hombre", "remera"],
      },
      {
        id: generarId(),
        nombre: "Producto 2",
        precio: "200",
        imagen: "../assets/img/ropa2.jpeg",
        destacado: true,
        categories: ["mujer", "pantalon"],
      },
      {
        id: generarId(),
        nombre: "Producto 3",
        precio: "150",
        imagen: "../assets/img/ropa3.jpeg",
        destacado: false,
        categories: ["hombre", "buzo"],
      },
      {
        id: generarId(),
        nombre: "Producto 4",
        precio: "180",
        imagen: "../assets/img/ropa1.jpeg",
        destacado: false,
        categories: ["mujer", "remera"],
      },
      {
        id: generarId(),
        nombre: "Producto 5",
        precio: "250",
        imagen: "../assets/img/ropa2.jpeg",
        destacado: true,
        categories: ["hombre", "jeans"],
      },
      {
        id: generarId(),
        nombre: "Producto 6",
        precio: "220",
        imagen: "../assets/img/ropa3.jpeg",
        destacado: false,
        categories: ["mujer", "buzo"],
      },
      {
        id: generarId(),
        nombre: "Producto 4",
        precio: "180",
        imagen: "../assets/img/ropa1.jpeg",
        destacado: false,
        categories: ["mujer", "remera"],
      },
      {
        id: generarId(),
        nombre: "Producto 5",
        precio: "250",
        imagen: "../assets/img/ropa2.jpeg",
        destacado: true,
        categories: ["hombre", "jeans"],
      },
      {
        id: generarId(),
        nombre: "Producto 6",
        precio: "220",
        imagen: "../assets/img/ropa3.jpeg",
        destacado: false,
        categories: ["mujer", "buzo"],
      },
      {
        id: generarId(),
        nombre: "Producto 1",
        precio: "100",
        imagen: "../assets/img/ropa1.jpeg",
        destacado: true,
        categories: ["hombre", "remera"],
      },
      {
        id: generarId(),
        nombre: "Producto 2",
        precio: "200",
        imagen: "../assets/img/ropa2.jpeg",
        destacado: true,
        categories: ["mujer", "pantalon"],
      },
      {
        id: generarId(),
        nombre: "Producto 3",
        precio: "150",
        imagen: "../assets/img/ropa3.jpeg",
        destacado: false,
        categories: ["hombre", "buzo"],
      },
    ];

    localStorage.setItem("productos", JSON.stringify(productos));
    console.log("Productos iniciales guardados en localStorage.");
  } else {
    console.log("Ya hay productos guardados en localStorage.");
  }
});
// Obtener los productos de localStorage
const productosGuardados = localStorage.getItem("productos");
// Convertir el string JSON a un objeto
const productos = JSON.parse(productosGuardados);
console.log("Productos guardados en localStorage:", productos);
const contenedorDestacado = document.getElementById(
  "contenedor-productos-destacados"
);
const contenedor = document.getElementById("contenedor-productos");
const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado")); //Obtengo el usuario logueado

// funcion para mostrar el formulario de ELIMINAR CUANDO EL USUARIO ES ADMIN
window.mostrarFormularioEliminar = (idProducto) => {
  const newForm = document.getElementById("newForm");

  newForm.innerHTML = `
   <div id="modalEliminar" class="custom-modal">
      <div class="modal-content">
        <span id="cerrarEliminar" class="close">&times;</span>
        <h2>Eliminar Producto</h2>
        <div id="aviso-eliminar" class="mensaje_tarjeta"></div>
        <form id="formEliminarProducto">
          <p>¿Seguro que querés eliminar el producto con ID: <strong>${idProducto}</strong>?</p>
          <button type="submit">Eliminar</button>
        </form>
      </div>
    </div>
  `;

  document
    .getElementById("formEliminarProducto")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      eliminarProducto(idProducto);
    });
  document.getElementById("cerrarEliminar").addEventListener("click", () => {
    newForm.innerHTML = "";
  });
};
const eliminarProducto = (id) => {
  const productos = JSON.parse(localStorage.getItem("productos")) || [];

  const nuevoArray = productos.filter((p) => Number(p.id) !== id);
  localStorage.setItem("productos", JSON.stringify(nuevoArray));
  const newForm = document.getElementById("newForm");
  console.log(productos);
  newForm.innerHTML = ``;
};
// FUNCION PARA MOSTRAR EL FORMULARIO DE ACTUALIZAR CUANDO EL USUARIO ES ADMIN
window.mostrarFormularioActualizar = (idProducto) => {
  const producto = productos.find((p) => p.id === idProducto);
  if (!producto) return alert("Producto no encontrado");

  const newForm = document.getElementById("newForm");

  newForm.innerHTML = `
  <div id="modalActualizar" class="custom-modal">
    <div class="modal-content">
      <span id="cerrarActualizar" class="close">&times;</span>
      <h2>Actualizar Producto</h2>
      <div id="aviso-actualizar" class="mensaje_tarjeta"></div>
      <form id="formActualizarProducto">
        <input id="nombreActualizado" type="text" placeholder="Nuevo nombre" value="${
          producto.nombre
        }" />
        <input id="precioActualizado" type="number" placeholder="Nuevo precio" value="${
          producto.precio
        }" />
        <input id="categoriaActualizada" type="text" placeholder="Nueva categoría" value="${
          producto.categoria || ""
        }" />
        <textarea id="descripcionActualizada" placeholder="Nueva descripción">${
          producto.descripcion || ""
        }</textarea>
        <input id="imagenActualizada" type="text" placeholder="Nueva imagen (URL)" value="${
          producto.imagen
        }" />
        <label>
          Producto destacado:
          <input id="destacadoActualizado" type="checkbox" ${
            producto.destacado ? "checked" : ""
          } />
        </label>
        <button type="submit">Actualizar</button>
      </form>
    </div>
  </div>
  `;

  // Listener para cerrar modal
  document.getElementById("cerrarActualizar").addEventListener("click", () => {
    newForm.innerHTML = "";
  });

  // Listener para el submit del formulario
  document
    .getElementById("formActualizarProducto")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      actualizarProducto(idProducto);
    });
};
const actualizarProducto = (id) => {
  const productos = JSON.parse(localStorage.getItem("productos")) || [];

  const producto = productos.find((p) => Number(p.id) === id);

  if (!producto) {
    const msg = document.getElementById("aviso-actualizar");
    msg.style.display = "block";
    msg.innerHTML = `<h2 class="producto-no-encontrado">¡Producto no encontrado!</h2>`;
    msg.classList.add("visible");
    setTimeout(() => {
      msg.classList.remove("visible");
      setTimeout(() => {
        msg.style.display = "none";
      }, 500);
    }, 3000);
    return;
  }

  // Obtenemos valores del formulario
  const nuevoNombre = document.getElementById("nombreActualizado").value.trim();
  const nuevoPrecio = document.getElementById("precioActualizado").value.trim();
  const nuevaCategoria = document
    .getElementById("categoriaActualizada")
    .value.trim();
  const nuevaDescripcion = document
    .getElementById("descripcionActualizada")
    .value.trim();
  const nuevaImagen = document.getElementById("imagenActualizada").value.trim();
  const nuevoDestacado = document.getElementById(
    "destacadoActualizado"
  ).checked;

  // Actualizamos solo si hay valor
  if (nuevoNombre) producto.nombre = nuevoNombre;
  if (nuevoPrecio) producto.precio = nuevoPrecio;
  if (nuevaCategoria) producto.categoria = nuevaCategoria; // fijate que antes usabas `categories`
  if (nuevaDescripcion) producto.descripcion = nuevaDescripcion;
  if (nuevaImagen) producto.imagen = nuevaImagen;

  producto.destacado = nuevoDestacado;

  localStorage.setItem("productos", JSON.stringify(productos));

  // Mostrar mensaje de éxito
  const msg = document.getElementById("aviso-actualizar");
  msg.style.display = "block";
  msg.innerHTML = `<h2 class="producto-encontrado">¡Actualizado con éxito!</h2>`;
  msg.classList.add("visible");

  setTimeout(() => {
    msg.classList.remove("visible");
    setTimeout(() => {
      msg.style.display = "none";
      document.getElementById("newForm").innerHTML = "";
    }, 500);
  }, 3000);
};
// Mostrar productos
productos.forEach((p) => {
  // Mostrar productos destacados
  if (p.destacado && contenedorDestacado) {
    let cardHTML = `
    <div>
         <a class="link-productos" href="productos/${p.nombre}">
          <div class="product-card card">
              <img src="${p.imagen}" alt="${p.nombre}">
              <h3>${p.nombre}</h3>
              <p class="price">$${p.precio}</p>
          </div>
        </a>
  `;
    // Si es admin, le agregamos los botones
    if (usuarioLogueado) {
      if (usuarioLogueado.rol === "admin") {
        cardHTML += `
      <div class="admin-buttons">
        <button class="icon-button eliminar" onclick="mostrarFormularioEliminar(${p.id})" title="Eliminar">
          <i class="fas fa-trash"></i>
        </button>
        <button class="icon-button actualizar" onclick="mostrarFormularioActualizar(${p.id})" title="Actualizar">
          <i class="fas fa-pen-to-square"></i>
        </button>
      </div>
    `;
      }
    }

    // Cerramos el div
    cardHTML += `</div>`;

    contenedorDestacado.innerHTML += cardHTML;
    // mostrar productos no descatos en el apartado de productos
  } else if (!p.destacado && contenedor) {
    let cardHTML = `
    <div class>
         <a class="link-productos" href="productos/${p.nombre}">
          <div class="product-card card">
              <img src="${p.imagen}" alt="${p.nombre}">
              <h3>${p.nombre}</h3>
              <p class="price">$${p.precio}</p>
          </div>
        </a>
  `;
    // Si es admin, le agregamos los botones
    if (usuarioLogueado.rol === "admin") {
      cardHTML += `
      <div class="admin-buttons">
        <button class="icon-button eliminar" onclick="mostrarFormularioEliminar(${p.id})" title="Eliminar">
          <i class="fas fa-trash"></i>
        </button>
        <button class="icon-button actualizar" onclick="mostrarFormularioActualizar(${p.id})" title="Actualizar">
          <i class="fas fa-pen-to-square"></i>
        </button>
      </div>
    `;
    }

    // Cerramos el div
    cardHTML += `</div>`;

    contenedor.innerHTML += cardHTML;
  }
});

// FILTRAR PRODUCTOS
const checkboxes = document.querySelectorAll(".category-checkbox");
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", filtrarProductos);
});

//Funcion para filtrar productos
function filtrarProductos() {
  const checkboxes = document.querySelectorAll(".category-checkbox");
  const categoriasSeleccionadas = Array.from(checkboxes)
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);
  // Obtener el valor de la barra de busqueda
  const textoBusqueda = document
    .getElementById("busqueda")
    .value.trim()
    .toLowerCase();
  //limpiar el contenedor
  contenedor.innerHTML = "";
  // filtrar los productos
  const filtrados = productos.filter((p) => {
    const coincideCategoria =
      categoriasSeleccionadas.length === 0 ||
      categoriasSeleccionadas.some((cat) => p.categories.includes(cat));

    const coincideBusquedaNombre = p.nombre
      .toLowerCase()
      .includes(textoBusqueda);
    const coincideBusquedaCategoria = p.categories.some((cat) =>
      cat.toLowerCase().includes(textoBusqueda)
    );

    const coincideBusqueda =
      coincideBusquedaNombre || coincideBusquedaCategoria;

    return coincideCategoria && coincideBusqueda;
  });
  // hacemor un bucle para mostrar los productos filtrados
  if (filtrados.length === 0) {
    contenedor.innerHTML = `<p class="no-results">No se encontraron productos</p>`;
  }
  filtrados.forEach((p) => {
    contenedor.innerHTML += `
      <a class="link-productos" href="productos/${p.nombre}">
        <div class="card">
          <img src="${p.imagen}" alt="${p.nombre}">
          <h3>${p.nombre}</h3>
          <p>$${p.precio}</p>
        </div>
      </a>
    `;
  });
}

// Agregar evento para escuchar cambios en la barra de busqueda
const inputBusqueda = document.getElementById("busqueda");
if (inputBusqueda) {
  inputBusqueda.addEventListener("input", filtrarProductos);
}
