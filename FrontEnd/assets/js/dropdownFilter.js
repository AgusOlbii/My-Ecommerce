const handleDropdown = (event) => {
  const toggleBtn = event.target.closest(".dropdown-toggle");
  if (!toggleBtn) return;

  const dropdown = toggleBtn.closest(".dropdown");
  if (!dropdown) return;

  const dropdownMenu = dropdown.querySelector(".checkbox-group");
  if (!dropdownMenu) return;

  const isOpen = dropdownMenu.classList.contains("show");

  // Cerrar todos los dropdowns abiertos menos el actual
  document.querySelectorAll(".checkbox-group").forEach((menu) => {
    if (menu !== dropdownMenu) {
      menu.classList.remove("show");
    }
  });

  // Toggle el dropdown actual
  dropdownMenu.classList.toggle("show", !isOpen);
};

document.addEventListener("click", handleDropdown);
