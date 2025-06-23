const API_URL = "http://127.0.0.1:5000";
const contenedorDestacado = document.getElementById(
  "contenedor-productos-destacados"
); // Obtenemos el contenedor de los productos destacados
const contenedor = document.getElementById("contenedor-productos"); // obtenemos el contenedor de los productos no destacados
// Funcion asincrona para obtener los productos de la API
export async function obtenerProductos() {
  const API_URL = "http://127.0.0.1:5000"; // Define API_URL si no está ya definida globalmente aquí

  try {
    const res = await fetch(`${API_URL}/productos`);
    if (!res.ok) {
      throw new Error(
        `Error al obtener productos: ${res.status} ${res.statusText}`
      );
    }
    const productos = await res.json();
    console.log("Productos obtenidos:", productos);
    return productos; // Retorna los productos
  } catch (error) {
    console.error("Error al cargar productos:", error);
    // Podrías devolver un array vacío o relanzar el error según tu estrategia
    return error;
  }
}

let productos = await obtenerProductos();
// Funcion para mostrar los productos en el HTML
export const mostrarProductos = (productos, usuarioLogueado) => {
  console.log("Mostrando productos:", productos);
  if (contenedor || contenedorDestacado) {
    // Limpiamos los contenedores antes de mostrar los productos
    if (contenedor) contenedor.innerHTML = "";
    if (contenedorDestacado) contenedorDestacado.innerHTML = "";
  } //SE VALIDA SI EXISTE ALGUN CONTENEDOR PARA VACIARLOS ANTES DE MOSTRAR LOS PRODUCTOS PARA EVITAR ERRORES
  productos.forEach((p) => {
    // Mostrar productos destacados
    console.log("Imagen del producto:", p.imagen);
    if (p.destacado && contenedorDestacado) {
      contenedorDestacado.innerHTML = "";

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
      console.log("Usuario logueado:", usuarioLogueado);
      if (usuarioLogueado) {
        if (
          usuarioLogueado &&
          (usuarioLogueado.rol === "admin" ||
            usuarioLogueado.rol === "superadmin")
        ) {
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
    <div> 
          <div class="product-card card">
          <a class="link-productos" href="productos/${p.nombre}">
              <img src="${p.imagen}" alt="${p.nombre}">
              <h3>${p.nombre}</h3>
              <p class="price">$${p.precio}</p>
              </a>
              <button
                class="add-to-cart-btn"
                data-id="${p.id}"
                data-nombre="${p.nombre}"
                data-precio="${p.precio}"
                data-imagen="${p.imagen}"
              >
                Agregar al carrito
              </button>
          </div>
  `;
      console.log("Usuario logueado:", usuarioLogueado);
      // Si es admin, le agregamos los botones
      if (
        usuarioLogueado &&
        (usuarioLogueado.rol === "admin" ||
          usuarioLogueado.rol === "superadmin")
      ) {
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
};

// Funcion para obtener los productos de la api una vez se elimino/actualizo/agrego un producto
const obtenerYRenderizarProductos = async () => {
  try {
    const resp = await fetch(`${API_URL}/usuarios/actual`, {
      method: "GET", // Es un GET
      credentials: "include", // ¡CRÍTICO para que el navegador envíe la cookie 'session'!
    });
    const usuarioLogueado = await resp.json();
    const productosActualizados = await fetch(
      "http://127.0.0.1:5000/productos"
    ).then((res) => res.json());
    console.log("Productos traídos:", productosActualizados);
    if (contenedor) contenedor.innerHTML = "";
    if (contenedorDestacado) contenedorDestacado.innerHTML = "";
    productos = productosActualizados;
    mostrarProductos(productos, usuarioLogueado);
  } catch (error) {
    console.error("Error al traer productos:", error);
  }
};

console.log("Productos traidos de la API: ", productos);

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
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const ok = await eliminarProducto(idProducto); // Esperamos confirmación

      if (ok) {
        newForm.innerHTML = ""; // Cerramos el modal si la eliminación fue exitosa
      } else {
        document.getElementById("aviso-eliminar").textContent =
          "Hubo un error al eliminar el producto.";
      }
    });

  // Al hacer click en la X
  document.getElementById("cerrarEliminar").addEventListener("click", () => {
    newForm.innerHTML = "";
  });
};
// FUNCION PARA ELIMINAR UN PRODUCTO
export const eliminarProducto = async (id) => {
  try {
    const respuesta = await fetch(`http://127.0.0.1:5000/productos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (respuesta.ok) {
      // Opcional: puedes volver a cargar los productos desde el backend
      console.log(productos);
      // Actualiza la vista: por ejemplo, vuelve a renderizar la lista
      await obtenerYRenderizarProductos();
      return true;
      // esta función debe volver a hacer GET al backend
    } else {
      alert("No se pudo eliminar el producto");
      return false;
    }
  } catch (error) {
    console.error("Error al eliminar:", error);
    alert("Error de conexión");
  }
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
export const actualizarProducto = async (id) => {
  // Obtener valores del formulario
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

  // Construir objeto con los campos a actualizar (solo los que tengan valor)
  const datosActualizacion = { destacado: nuevoDestacado };
  if (nuevoNombre) datosActualizacion.nombre = nuevoNombre;
  if (nuevoPrecio && !isNaN(Number(nuevoPrecio)))
    datosActualizacion.precio = Number(nuevoPrecio);
  if (nuevaCategoria) datosActualizacion.categoria = nuevaCategoria;
  if (nuevaDescripcion) datosActualizacion.descripcion = nuevaDescripcion;
  if (nuevaImagen) datosActualizacion.imagen = nuevaImagen;

  try {
    const response = await fetch(
      `http://127.0.0.1:5000/productos/actualizar/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosActualizacion),
      }
    );

    if (!response.ok) {
      throw new Error("Error al actualizar producto");
    }
    // Después de actualizar, podés recargar la lista de productos desde el backend
    await obtenerYRenderizarProductos();
    // Cerramos el modal
    const newForm = document.getElementById("newForm");
    if (newForm) {
      newForm.innerHTML = "";
    }
    // Creamos un div para informar si se ha actualizado correctamente
    const mensaje = document.createElement("div");
    mensaje.classList.add("modal-backdrop");
    mensaje.innerHTML = `<h2 class="producto-encontrado">¡Producto actualizado con éxito!</h2>`;

    document.body.appendChild(mensaje);
    requestAnimationFrame(() => mensaje.classList.add("visible"));

    setTimeout(() => {
      mensaje.remove();
    }, 3000);
  } catch (error) {
    console.error(error);

    const mensaje = document.createElement("div");
    mensaje.classList.add("modal-backdrop");
    mensaje.innerHTML = `<h2 class="producto-error">❌ No se pudo actualizar el producto</h2>`;

    document.body.appendChild(mensaje);
    requestAnimationFrame(() => mensaje.classList.add("visible"));

    setTimeout(() => {
      mensaje.remove();
    }, 3000);
  }
};

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
