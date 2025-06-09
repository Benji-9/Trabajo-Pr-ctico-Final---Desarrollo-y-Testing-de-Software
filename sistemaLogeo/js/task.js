// He combinado la lógica de la versión anterior con la nueva estructura de Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('taskForm');
  const taskList = document.getElementById('taskList');
  const filterStatus = document.getElementById('filterStatus');
  const userGreeting = document.getElementById('userGreeting');
  const dueDateInput = document.getElementById('dueDate');
  const submitButton = document.getElementById('addTask');
  const formTitle = document.getElementById('formTitle');
  const cancelEditButton = document.getElementById('cancelEdit');
  
  let editingIndex = null;

  const user = JSON.parse(localStorage.getItem("activeUser"));
  if (!user) {
    alert("Debe iniciar sesión.");
    window.location.href = "index.html";
    return;
  }

  if (userGreeting) userGreeting.textContent = `Hola, ${user.username}`;
  if (dueDateInput) dueDateInput.setAttribute('min', new Date().toISOString().split('T')[0]);

  function getTasks() { return JSON.parse(localStorage.getItem('tasks')) || []; }
  function saveTasks(tasks) { localStorage.setItem('tasks', JSON.stringify(tasks)); }

  function renderTasks() {
    const allTasks = getTasks();
    const filter = filterStatus.value;
    const tasksToRender = filter === "Todas" ? allTasks : allTasks.filter(task => task.status === filter);

    tasksToRender.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    taskList.innerHTML = '';
    
    if (tasksToRender.length === 0) {
      taskList.innerHTML = `<div class="alert alert-info">No hay tareas para mostrar con el filtro actual.</div>`;
      return;
    }

    tasksToRender.forEach(task => {
      const originalIndex = allTasks.findIndex(t => t === task);
      const taskCard = document.createElement('div');
      
      let statusInfo = '';
      if (task.status === 'completada') {
        taskCard.className = 'card shadow-sm mb-3 border-success text-muted';
        statusInfo = `<span class="badge bg-success">Completada</span>`;
      } else if (task.status === 'en-progreso') {
        taskCard.className = 'card shadow-sm mb-3 border-warning';
        statusInfo = `<span class="badge bg-warning text-dark">En Progreso</span>`;
      } else {
        taskCard.className = 'card shadow-sm mb-3 border-primary';
        statusInfo = `<span class="badge bg-primary">Pendiente</span>`;
      }

      taskCard.innerHTML = `
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <h5 class="card-title mb-1">${task.title}</h5>
            ${statusInfo}
          </div>
          <p class="card-text mb-2">${task.description}</p>
          <small class="d-block mb-1"><strong>Vence:</strong> ${task.dueDate}</small>
          <small class="d-block text-body-secondary"><em>Creado por: ${task.user}</em></small>
          <div class="actions mt-3"></div>
        </div>
      `;
      
      const actionsDiv = taskCard.querySelector('.actions');
      if (task.status !== 'completada' && task.user === user.username) {
        const completeBtn = document.createElement('button');
        completeBtn.className = 'btn btn-success btn-sm me-2';
        completeBtn.textContent = 'Completar';
        completeBtn.onclick = () => completeTask(originalIndex);
        actionsDiv.appendChild(completeBtn);
      }

      if (task.user === user.username) {
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-warning btn-sm me-2';
        editBtn.textContent = 'Editar';
        editBtn.onclick = () => enterEditMode(originalIndex);
        actionsDiv.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.onclick = () => deleteTask(originalIndex);
        actionsDiv.appendChild(deleteBtn);
      }
      
      taskList.appendChild(taskCard);
    });
  }

  function enterEditMode(index) {
    const task = getTasks()[index];
    formTitle.textContent = "Editando Tarea";
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('status').value = task.status;
    document.getElementById('dueDate').value = task.dueDate;
    submitButton.textContent = 'Actualizar Tarea';
    cancelEditButton.style.display = 'block';
    editingIndex = index;
    formTitle.scrollIntoView({ behavior: 'smooth' });
  }

  function exitEditMode() {
    formTitle.textContent = "Crear Nueva Tarea";
    submitButton.textContent = 'Agregar Tarea';
    cancelEditButton.style.display = 'none';
    editingIndex = null;
    taskForm.reset();
  }

  function completeTask(index) {
    const tasks = getTasks();
    tasks[index].status = 'completada';
    saveTasks(tasks);
    renderTasks();
  }

  function deleteTask(index) {
    if (confirm('¿Estás seguro?')) {
      const tasks = getTasks();
      tasks.splice(index, 1);
      saveTasks(tasks);
      if (index === editingIndex) exitEditMode();
      renderTasks();
    }
  }

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const tasks = getTasks();
    const taskData = {
      title: document.getElementById('title').value.trim(),
      description: document.getElementById('description').value.trim(),
      dueDate: document.getElementById('dueDate').value,
      status: document.getElementById('status').value,
    };
    if (editingIndex !== null) {
      tasks[editingIndex] = { ...tasks[editingIndex], ...taskData };
    } else {
      tasks.push({ ...taskData, user: user.username });
    }
    saveTasks(tasks);
    renderTasks();
    exitEditMode();
  });

  cancelEditButton.addEventListener('click', exitEditMode);
  filterStatus.addEventListener('change', renderTasks);
  
  renderTasks();
});