function logout() {
  localStorage.removeItem("activeUser");
  window.location.href = "index.html";
}
