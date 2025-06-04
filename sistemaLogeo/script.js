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

  function validateUsername(username) {
    const regex = /^[A-Za-z0-9]{3,16}$/;
    return regex.test(username);
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

      if (!validateUsername(user)) {
        alert("El usuario debe tener entre 3 y 16 caracteres, sólo se permiten letras y números sin espacios.");
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

  document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const dueDateInput = document.getElementById('dueDate');
    const statusInput = document.getElementById('status');
    const filterInput = document.getElementById('filter');
    const taskList = document.getElementById('taskList');
    const addBtn = document.getElementById('addTask');
  
    // Cargar tareas desde localStorage
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
  
    function guardarTareas() {
      localStorage.setItem('tareas', JSON.stringify(tareas));
    }
  
    function renderTareas(filtro = 'todas') {
      taskList.innerHTML = '';
  
      const tareasFiltradas = filtro === 'todas'
        ? tareas
        : tareas.filter(t => t.estado === filtro);
  
      if (tareasFiltradas.length === 0) {
        taskList.innerHTML = '<p>No hay tareas disponibles.</p>';
        return;
      }
  
      tareasFiltradas.forEach((tarea, index) => {
        const div = document.createElement('div');
        div.classList.add('task');
        div.innerHTML = `
          <h3>${tarea.titulo}</h3>
          <p>${tarea.descripcion}</p>
          <small>Vence: ${tarea.fecha}</small><br>
          <small>Estado: ${tarea.estado}</small>
          <div class="actions">
            <button class="action delete" data-index="${index}">Eliminar</button>
          </div>
        `;
        taskList.appendChild(div);
      });
    }
  
    // Agregar nueva tarea
    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
  
      const nuevaTarea = {
        titulo: titleInput.value,
        descripcion: descriptionInput.value,
        fecha: dueDateInput.value,
        estado: statusInput.value
      };
  
      if (!nuevaTarea.titulo || !nuevaTarea.descripcion || !nuevaTarea.fecha) {
        alert("Todos los campos son obligatorios.");
        return;
      }

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Para comparar solo fecha, sin hora
      const fechaIngresada = new Date(nuevaTarea.fecha);

      if (fechaIngresada < hoy) {
        alert("No se puede asignar una tarea con una fecha que ya pasó.");
        return;
      }
  
      tareas.push(nuevaTarea);
      guardarTareas();
      renderTareas(filterInput.value);
  
      titleInput.value = '';
      descriptionInput.value = '';
      dueDateInput.value = '';
      statusInput.value = 'pendiente';
    });
  
    // Filtrar tareas por estado
    filterInput.addEventListener('change', () => {
      renderTareas(filterInput.value);
    });
  
    // Eliminar tarea
    taskList.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete')) {
        const index = e.target.dataset.index;
        tareas.splice(index, 1);
        guardarTareas();
        renderTareas(filterInput.value);
      }
    });
  
    // Mostrar tareas al cargar
    renderTareas();
  });  

  document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const iconEye = document.getElementById('iconEye');
  
    if (togglePassword && passwordInput && iconEye) {
      togglePassword.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        iconEye.src = isPassword ? 'img/eye.svg' : 'img/hide.svg';
        iconEye.alt = isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña';
      });
    }
  });  

  document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.getElementById('togglePasswordReg');
    const passwordInput = document.getElementById('newPassword');
    const iconEye = document.getElementById('iconEye');
  
    if (togglePassword && passwordInput && iconEye) {
      togglePassword.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        iconEye.src = isPassword ? 'img/eye.svg' : 'img/hide.svg';
        iconEye.alt = isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña';
      });
    }
  });  
