// ==========================================
// LA MUSA INCARNATA
// ==========================================

// =========================
// MENÚ MOBILE
// =========================

const menuButton = document.querySelector(".nav__button");
const nav = document.querySelector(".nav");

menuButton.addEventListener("click", () => {
  nav.classList.toggle("active");

  const isOpen = nav.classList.contains("active");

  menuButton.setAttribute("aria-expanded", isOpen);

  menuButton.textContent = isOpen ? "✕" : "☰";
});
