const cart = {
  items: [],

  // Agrega producto al carrito
  addItem(product) {
    const existing = this.items.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    this.saveToStorage(); // Guardar cada vez que se agrega
    this.updateUI();
  },

  // Guarda en localStorage
  saveToStorage() {
    localStorage.setItem("cartItems", JSON.stringify(this.items));
  },

  // Carga desde localStorage
  loadFromStorage() {
    const stored = localStorage.getItem("cartItems");
    if (stored) {
      this.items = JSON.parse(stored);
    } else {
      this.items = [];
    }
    this.updateUI();
  },

  // Actualiza UI del dropdown
  updateUI() {
    console.log("🔄 Actualizando UI con:", this.items);

    const cartCountElem = document.getElementById("cartCount");
    const cartItemsList = document.getElementById("cartItemsList");
    const emptyMsg = document.querySelector(".empty-message");
    const goToCartBtn = document.getElementById("goToCart");

    const totalQuantity = this.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    cartCountElem.textContent = totalQuantity;

    if (this.items.length === 0) {
      emptyMsg.style.display = "block";
      cartItemsList.style.display = "none";
      goToCartBtn.style.display = "none";
    } else {
      emptyMsg.style.display = "none";
      cartItemsList.style.display = "block";
      goToCartBtn.style.display = "block";

      cartItemsList.innerHTML = "";
      this.items.forEach((item) => {
        const li = document.createElement("li");

        const nombre = item.nombre || "Producto sin nombre";
        const precio = Number(item.precio) || 0;
        const quantity = item.quantity || 0;

        li.innerHTML = `
        <div>
          <img src="${
            item.imagen || "#"
          }" alt="${nombre}" style="width:40px; height:40px; object-fit: cover; margin-right: 10px;">
          <span class="description-dropdown-cart">${nombre} x${quantity} - $${
          precio * quantity
        }</span>
        </div>
        `;

        cartItemsList.appendChild(li);
      });
    }
  },
};
// Consultamos si el usuario esta logueado
const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

document.addEventListener("DOMContentLoaded", () => {
  cart.loadFromStorage();

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
      if (usuarioLogueado) {
        const btn = e.target;

        const product = {
          id: parseInt(btn.dataset.id),
          nombre: btn.dataset.nombre,
          precio: parseFloat(btn.dataset.precio),
          imagen: btn.dataset.imagen,
        };

        cart.addItem(product);
      } else {
        // Crear el cartel
        const alerta = document.createElement("div");
        alerta.textContent =
          "Debes iniciar sesión para agregar productos al carrito";
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

        document.body.appendChild(alerta);

        // Eliminar el cartel después de 3 segundos
        setTimeout(() => {
          alerta.remove();
        }, 3000);
      }
    }
  });
});
