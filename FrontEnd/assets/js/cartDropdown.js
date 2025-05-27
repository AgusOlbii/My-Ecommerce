const cartButton = document.getElementById("cartButton");
const cartDropdown = document.getElementById("cartDropdown");

cartButton.addEventListener("click", (e) => {
  e.stopPropagation();
  cartDropdown.classList.toggle("show");
});

// Cerrar dropdown si se hace click afuera
document.addEventListener("click", () => {
  cartDropdown.classList.remove("show");
});
