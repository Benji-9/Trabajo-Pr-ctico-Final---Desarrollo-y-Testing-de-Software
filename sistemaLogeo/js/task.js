const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const filterStatus = document.getElementById('filter');

const user = JSON.parse(localStorage.getItem("activeUser"));
if (!user) {
  alert("Debe iniciar sesión.");
  window.location.href = "index.html";
}

function getTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getUserTasks() {
  return getTasks().filter(t => t.user === user.username);
}

function renderTasks() {
  const filter = filterStatus.value;
  let tasks = getUserTasks();

  if (filter !== "todas") {
    tasks = tasks.filter(task => task.status === filter);
  }

  // Ordenar por fecha de vencimiento ascendente
  tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';

  taskDiv.innerHTML = `
    <h4>${task.title}</h4>
    <p>${task.description}</p>
    <p><strong>Estado:</strong> ${task.status}</p>
    <p><strong>Vence:</strong> ${task.dueDate}</p>

    <div class="actions">
      <button class="edit" onclick="editTask(${index})">Editar</button>
      <button class="delete" onclick="deleteTask(${index})">Eliminar</button>
    </div>
  `;


    taskList.appendChild(taskDiv);
  });
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const dueDate = document.getElementById('dueDate').value;
  const status = document.getElementById('status').value;

  if (!title || !description || !dueDate) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const newTask = { title, description, status, dueDate, user: user.username };
  const tasks = getTasks();
  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks();
  taskForm.reset();
});

function deleteTask(index) {
  const allTasks = getTasks();
  const userTasks = getUserTasks();
  const taskToDelete = userTasks[index];

  const filteredTasks = allTasks.filter(
    t => !(t.user === taskToDelete.user && t.title === taskToDelete.title && t.dueDate === taskToDelete.dueDate)
  );
  saveTasks(filteredTasks);
  renderTasks();
}

function editTask(index) {
  const userTasks = getUserTasks();
  const task = userTasks[index];

  document.getElementById('title').value = task.title;
  document.getElementById('description').value = task.description;
  document.getElementById('status').value = task.status;
  document.getElementById('dueDate').value = task.dueDate;

  deleteTask(index); // Reemplaza al guardar
}

filterStatus.addEventListener('change', renderTasks);

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem("activeUser"));
  if (!user) {
    alert("Debe iniciar sesión.");
    window.location.href = "index.html";
    return;
  }

  const greeting = document.getElementById('userGreeting');
  if (greeting) {
    greeting.textContent = `Hola, ${user.username}`;
  }

  renderTasks();
}); 