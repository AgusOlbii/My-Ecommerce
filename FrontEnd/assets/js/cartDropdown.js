document.addEventListener("DOMContentLoaded", () => {
  const cartButton = document.getElementById("cartButton");
  const cartDropdown = document.getElementById("cartDropdown");

  cartButton.addEventListener("click", () => {
    const isVisible = cartDropdown.style.display === "block";
    cartDropdown.style.display = isVisible ? "none" : "block";
    cartButton.setAttribute("aria-expanded", !isVisible);
  });

  document.addEventListener("click", (e) => {
    if (!cartButton.contains(e.target) && !cartDropdown.contains(e.target)) {
      cartDropdown.style.display = "none";
      cartButton.setAttribute("aria-expanded", false);
    }
  });
});
