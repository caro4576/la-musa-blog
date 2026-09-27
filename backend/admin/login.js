const form = document.querySelector("#login-form");
const error = document.querySelector("#error");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  error.textContent = "";

  const usuario = document.querySelector("#usuario").value;
  const password = document.querySelector("#password").value;

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ usuario, password }),
    });

    const resultado = await response.json();

    if (!response.ok) {
      error.textContent = resultado.error || "No se pudo iniciar sesión.";
      return;
    }

    window.location.href = "/admin/";
  } catch (err) {
    error.textContent = "No se pudo conectar con el servidor.";
  }
});