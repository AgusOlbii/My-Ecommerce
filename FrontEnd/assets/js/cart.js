const API_URL = "http://127.0.0.1:5000";

const cart = {
  items: [],
  updateUI() {
    const cartCountElem = document.getElementById("cartCount");
    const cartItemsList = document.getElementById("cartItemsList"); // Dropdown
    const emptyMsg = document.querySelector(".empty-message");
    const goToCartBtn = document.getElementById("goToCart");
    const cartItemsListMain = document.getElementById("cartItemsListMain"); // Página carrito
    const cartTotalElem = document.getElementById("cartTotal");
    const checkoutBtn = document.getElementById("checkoutBtn");

    const totalQuantity = this.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    if (cartCountElem) cartCountElem.textContent = totalQuantity;

    // Actualizar dropdown carrito
    if (this.items.length === 0) {
      if (emptyMsg) emptyMsg.style.display = "block";
      if (cartItemsList) cartItemsList.style.display = "none";
      if (goToCartBtn) goToCartBtn.style.display = "none";
    } else {
      if (emptyMsg) emptyMsg.style.display = "none";
      if (cartItemsList) {
        cartItemsList.style.display = "block";
        cartItemsList.innerHTML = "";
        this.items.forEach((item) => {
          const li = document.createElement("li");
          li.innerHTML = `
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${item.imagen || "#"}" alt="${
            item.nombre
          }" style="width:40px; height:40px; object-fit:cover;">
            <span class="description-dropdown-cart">${item.nombre}</span>
            <div style="display:flex; align-items:center; gap:5px;">
              <button class="quantity-btn decrease" data-id="${
                item.id
              }">➖</button>
              <span>${item.quantity}</span>
              <button class="quantity-btn increase" data-id="${
                item.id
              }">➕</button>
            </div>
            <span>$${(item.precio * item.quantity).toFixed(2)}</span>
            <button class="remove-btn" data-id="${item.id}">🗑</button>
          </div>
        `;
          cartItemsList.appendChild(li);
        });
      }
      if (goToCartBtn) goToCartBtn.style.display = "block";
    }

    // Actualizar lista principal del carrito en cart.html
    if (cartItemsListMain) {
      cartItemsListMain.innerHTML = "";

      if (this.items.length === 0) {
        cartItemsListMain.innerHTML = `<li class="list-group-item">El carrito está vacío.</li>`;
        if (checkoutBtn) checkoutBtn.disabled = true;
        if (cartTotalElem) cartTotalElem.textContent = "0.00";
      } else {
        this.items.forEach((item) => {
          const li = document.createElement("li");
          li.className =
            "list-group-item d-flex justify-content-between align-items-center";
          li.innerHTML = `
          <div style="display:flex; align-items:center; gap:15px; flex-grow: 1;">
            <img src="${item.imagen || "#"}" alt="${
            item.nombre
          }" style="width:80px; height:80px; object-fit:cover;">
            <div>
              <h5>${item.nombre}</h5>
              <p>$${item.precio.toFixed(2)}</p>
            </div>
            <div>
              <button class="quantity-btn decrease" data-id="${
                item.id
              }">➖</button>
              <span style="margin: 0 10px;">${item.quantity}</span>
              <button class="quantity-btn increase" data-id="${
                item.id
              }">➕</button>
            </div>
          </div>
          <div>
            <strong>$${(item.precio * item.quantity).toFixed(2)}</strong>
            <button class="remove-btn btn btn-link text-danger" data-id="${
              item.id
            }" title="Eliminar">🗑</button>
          </div>
        `;
          cartItemsListMain.appendChild(li);
        });

        if (checkoutBtn) checkoutBtn.disabled = false;
        if (cartTotalElem) {
          const total = this.items.reduce(
            (sum, item) => sum + item.precio * item.quantity,
            0
          );
          cartTotalElem.textContent = total.toFixed(2);
        }
      }
    }

    this.addCartItemEventListeners();
  },

  async addItem(product) {
    try {
      const response = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
        }),
      });

      if (response.status === 401) {
        this.showTemporaryAlert(
          "Debes iniciar sesión para agregar productos al carrito"
        );
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }

      const data = await response.json();
      console.log("Producto agregado al carrito:", data);
      await this.loadFromBackend();
    } catch (error) {
      console.error("Error agregando producto al carrito:", error.message);
      this.showTemporaryAlert("Error al agregar producto. Intenta de nuevo.");
    }
  },

  async loadFromBackend() {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        this.items = [];
        this.updateUI();
        return; // No hay sesión activa
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }

      const backendCartItems = await response.json();

      this.items = backendCartItems.map((item) => ({
        id: item.product_id,
        nombre: item.nombre,
        precio: item.precio,
        imagen: item.imagen,
        quantity: item.quantity,
      }));

      this.updateUI();
    } catch (error) {
      console.error("Error cargando carrito:", error.message);
      this.items = [];
      this.updateUI();
      this.showTemporaryAlert("No se pudo cargar el carrito del servidor.");
    }
  },

  async updateItemQuantity(id, newQuantity) {
    try {
      const response = await fetch(`${API_URL}/cart/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.status === 401) {
        this.showTemporaryAlert(
          "Debes iniciar sesión para modificar el carrito"
        );
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }

      await this.loadFromBackend();
    } catch (error) {
      console.error("Error actualizando cantidad:", error.message);
      this.showTemporaryAlert(
        "Error al actualizar la cantidad. Intenta de nuevo."
      );
    }
  },

  async removeItem(id) {
    try {
      const response = await fetch(`${API_URL}/cart/remove/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.status === 401) {
        this.showTemporaryAlert(
          "Debes iniciar sesión para modificar el carrito"
        );
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }

      await this.loadFromBackend();
    } catch (error) {
      console.error("Error eliminando producto:", error.message);
      this.showTemporaryAlert("Error al eliminar producto. Intenta de nuevo.");
    }
  },

  async clearCart() {
    try {
      const response = await fetch(`${API_URL}/cart/clear`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.status === 401) {
        this.showTemporaryAlert(
          "Debes iniciar sesión para modificar el carrito"
        );
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }

      await this.loadFromBackend();
      this.showTemporaryAlert("Carrito vaciado correctamente");
    } catch (error) {
      console.error("Error vaciando carrito:", error.message);
      this.showTemporaryAlert("Error al vaciar el carrito. Intenta de nuevo.");
    }
  },

  addCartItemEventListeners() {
    document.querySelectorAll(".increase").forEach((btn) => {
      btn.onclick = () => {
        const id = parseInt(btn.dataset.id);
        const item = this.items.find((i) => i.id === id);
        if (item) this.updateItemQuantity(id, item.quantity + 1);
      };
    });

    document.querySelectorAll(".decrease").forEach((btn) => {
      btn.onclick = () => {
        const id = parseInt(btn.dataset.id);
        const item = this.items.find((i) => i.id === id);
        if (item) {
          if (item.quantity > 1) {
            this.updateItemQuantity(id, item.quantity - 1);
          } else {
            this.removeItem(id);
          }
        }
      };
    });

    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.onclick = () => {
        const id = parseInt(btn.dataset.id);
        this.removeItem(id);
      };
    });
  },

  showTemporaryAlert(message) {
    const alerta = document.createElement("div");
    alerta.textContent = message;
    alerta.style.position = "fixed";
    alerta.style.top = "50%";
    alerta.style.left = "50%";
    alerta.style.transform = "translate(-50%, -50%)";
    alerta.style.backgroundColor = "rgba(0,0,0,0.8)";
    alerta.style.color = "white";
    alerta.style.padding = "20px 30px";
    alerta.style.borderRadius = "10px";
    alerta.style.zIndex = "9999";
    alerta.style.fontSize = "18px";
    alerta.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    document.body.appendChild(alerta);

    setTimeout(() => alerta.remove(), 3000);
  },
};

document.addEventListener("DOMContentLoaded", () => {
  cart.loadFromBackend();

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
      const btn = e.target;
      const product = {
        id: parseInt(btn.dataset.id),
        nombre: btn.dataset.nombre,
        precio: parseFloat(btn.dataset.precio),
        imagen: btn.dataset.imagen,
      };
      cart.addItem(product);
    }
  });

  const clearBtn = document.getElementById("clearCartBtn");
  if (clearBtn) clearBtn.addEventListener("click", () => cart.clearCart());
});
