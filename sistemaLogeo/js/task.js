document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('taskForm');
  const taskList = document.getElementById('taskList');
  const filterStatus = document.getElementById('filterStatus');
  const userGreeting = document.getElementById('userGreeting');
  const dueDateInput = document.getElementById('dueDate');
  if (dueDateInput) {
    const today = new Date().toISOString().split('T')[0];
    dueDateInput.setAttribute('min', today);
  }

  const user = JSON.parse(localStorage.getItem("activeUser"));
  if (!user) {
    alert("Debe iniciar sesión.");
    window.location.href = "index.html";
    return;
  }

  if (userGreeting) {
    userGreeting.textContent = `Hola, ${user.username}`;
  }

  function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
  }

  function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function renderTasks() {
    const filter = filterStatus.value;
    const allTasks = getTasks();
    let tasks = filter === "Todas" ? allTasks : allTasks.filter(task => task.status === filter);

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
        <p><em>Creado por: ${task.user}</em></p>
      `;

      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'actions';

      // Permitir marcar como completada si no lo está
      if (task.status !== 'completada') {
        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete';
        completeBtn.textContent = 'Marcar como completada';
        completeBtn.onclick = () => completeTask(index);
        actionsDiv.appendChild(completeBtn);
      }

      // Solo el creador puede editar o eliminar
      if (task.user === user.username) {
        const editBtn = document.createElement('button');
        editBtn.className = 'edit';
        editBtn.textContent = 'Editar';
        editBtn.onclick = () => editTask(index);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete';
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.onclick = () => deleteTask(index);

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
      }

      if (actionsDiv.children.length > 0) {
        taskDiv.appendChild(actionsDiv);
      }

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
      alert("Todos los campos son obligatorios.");
      return;
    }

    const newTask = { title, description, dueDate, status, user: user.username };
    const tasks = getTasks();
    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks();
    taskForm.reset();
  });

  function completeTask(index) {
    const tasks = getTasks();
    tasks[index].status = 'completada';
    saveTasks(tasks);
    renderTasks();
  }

  function deleteTask(index) {
    const tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTasks();
  }

  function editTask(index) {
    const tasks = getTasks();
    const task = tasks[index];

    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('status').value = task.status;
    document.getElementById('dueDate').value = task.dueDate;

    deleteTask(index); // Se reemplaza al guardar
  }

  filterStatus.addEventListener('change', renderTasks);
  renderTasks();
});
