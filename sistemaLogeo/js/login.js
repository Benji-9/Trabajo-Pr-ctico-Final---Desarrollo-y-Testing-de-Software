// Generic password visibility toggle
document.addEventListener('DOMContentLoaded', () => {
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const inputGroup = button.parentElement;
            const passwordInput = inputGroup.querySelector('input[type="password"], input[type="text"]');
            
            if (passwordInput) {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                button.textContent = type === 'password' ? 'Show' : 'Hide';
            }
        });
    });
});
function validatePassword(pwd) {
  const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(pwd);
}

function validateUsername(username) {
  const regex = /^[A-Za-z0-9]{3,16}$/;
  return regex.test(username);
}

function getUsersFromStorage() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsersToStorage(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function userExists(username, email) {
  const users = getUsersFromStorage();
  return users.some(user => user.username === username || user.email === email);
}

function registerUser(username, email, password) {
  const users = getUsersFromStorage();
  users.push({ username, email, password });
  saveUsersToStorage(users);
}

function validateLogin(username, password) {
  const users = getUsersFromStorage();
  return users.find(user => user.username === username && user.password === password);
}

// Handler for registration form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('newUsername').value.trim();
    const email = document.getElementById('newEmail').value.trim();
    const pwd = document.getElementById('newPassword').value;
    const error = document.getElementById('registerError');
    error.textContent = ''; // Clear previous errors

    if (!validateUsername(user)) {
      error.textContent = "Usuario inválido (3-16 letras/números).";
      return;
    }
    if (!validatePassword(pwd)) {
      error.textContent = "Contraseña débil (min 8 caracteres, 1 mayúscula, 1 número).";
      return;
    }
    if (userExists(user, email)) {
      error.textContent = "Usuario o email ya registrado.";
      return;
    }

    registerUser(user, email, pwd);
    alert("Registro exitoso");
    window.location.href = "index.html";
  });
}

// Handler for login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pwd = document.getElementById('password').value;
    const error = document.getElementById('loginError');
    error.textContent = ''; // Clear previous errors

    const validUser = validateLogin(user, pwd);
    if (!validUser) {
      error.textContent = "Credenciales incorrectas.";
      return;
    }

    localStorage.setItem("activeUser", JSON.stringify(validUser));
    window.location.href = "task-manager.html";
  });
}