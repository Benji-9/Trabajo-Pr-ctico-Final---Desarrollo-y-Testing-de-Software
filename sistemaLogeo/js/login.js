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

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(pwd) {
  const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(pwd);
}

function getUsersFromStorage() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function isUsernameTaken(username) {
  const users = getUsersFromStorage();
  return users.some(user => user.username.toLowerCase() === username.toLowerCase());
}

function isEmailTaken(email) {
  const users = getUsersFromStorage();
  return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

function registerUser(username, email, password) {
  const users = getUsersFromStorage();
  users.push({ username, email, password });
  localStorage.setItem("users", JSON.stringify(users));
}

function validateLogin(username, password) {
  const users = getUsersFromStorage();
  return users.find(user => user.username === username && user.password === password);
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pwd = document.getElementById('password').value;
    const error = document.getElementById('loginError');
    if(error) error.textContent = '';

    const validUser = validateLogin(user, pwd);
    if (validUser) {
        localStorage.setItem("activeUser", JSON.stringify(validUser));
        window.location.href = "task-manager.html";
    } else {
        if(error) error.textContent = "Credenciales incorrectas.";
    }
  });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('username-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    usernameError.textContent = '';
    usernameInput.classList.remove('is-invalid');
    emailError.textContent = '';
    emailInput.classList.remove('is-invalid');
    passwordError.textContent = '';
    passwordInput.classList.remove('is-invalid');

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    let formIsValid = true;

    if (username === '' || isUsernameTaken(username)) {
        usernameError.textContent = username === '' ? 'El nombre de usuario es obligatorio.' : 'Este nombre de usuario ya está en uso.';
        usernameInput.classList.add('is-invalid');
        formIsValid = false;
    }

    if (email === '') {
        emailError.textContent = 'El email es obligatorio.';
        emailInput.classList.add('is-invalid');
        formIsValid = false;
    } else if (!validateEmail(email)) {
        emailError.textContent = 'El formato del email no es válido.';
        emailInput.classList.add('is-invalid');
        formIsValid = false;
    } else if (isEmailTaken(email)) {
        emailError.innerHTML = `Este email ya está registrado. <a href="recover.html">¿Olvidaste tu contraseña?</a>`;
        emailInput.classList.add('is-invalid');
        formIsValid = false;
    }

    if (password === '' || !validatePassword(password)) {
        passwordError.textContent = password === '' ? 'La contraseña es obligatoria.' : 'Debe tener al menos 8 caracteres, 1 mayúscula y 1 número.';
        passwordInput.classList.add('is-invalid');
        formIsValid = false;
    }

    if (!formIsValid) {
        return;
    }

    registerUser(username, email, password);
    alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
    window.location.href = "index.html";
  });
}