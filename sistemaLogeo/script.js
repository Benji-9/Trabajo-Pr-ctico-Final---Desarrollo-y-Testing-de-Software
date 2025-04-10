function validatePassword(pwd) {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(pwd);
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
  
  // Registro
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('newUsername').value.trim();
      const email = document.getElementById('newEmail').value.trim();
      const pwd = document.getElementById('newPassword').value;
  
      if (!validatePassword(pwd)) {
        alert("La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.");
        return;
      }
  
      if (userExists(user, email)) {
        alert("El usuario o email ya está registrado.");
        return;
      }
  
      registerUser(user, email, pwd);
      alert("Usuario registrado exitosamente.");
      registerForm.reset();
      window.location.href = "index.html"; // redirige al login
    });
  }
  
  // Login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = document.getElementById('username').value.trim();
      const pwd = document.getElementById('password').value;

      if (!validatePassword(pwd)) {
        alert("Contraseña inválida.");
        return;
      }

      const user = validateLogin(username, pwd);
      if (!user) {
        alert("Credenciales incorrectas.");
        return;
      }

      // Guardar sesión activa y redirigir al Task Manager
      localStorage.setItem("activeUser", JSON.stringify(user));
      alert(`Bienvenido, ${user.username}`);
      window.location.href = "task-manager.html";
    });
  }

  // Mostrar/ocultar contraseña
  document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
      const input = button.previousElementSibling;
      const type = input.type === 'password' ? 'text' : 'password';
      input.type = type;
      button.textContent = type === 'password' ? '👁️' : '🙈';
    });
  });
  