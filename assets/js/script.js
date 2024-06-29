// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Create a task card
function createTaskCard(task) {
  return `
    <div class="card task-card" data-id="${task.id}">
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.description}</p>
        <p class="card-text"><small class="text-muted">Due: ${task.dueDate}</small></p>
        <button class="btn btn-danger btn-sm delete-btn">Delete</button>
      </div>
    </div>
  `;
}

// Render the task list and make cards draggable
function renderTaskList() {
  $('#todo-cards').empty();
  $('#in-progress-cards').empty();
  $('#done-cards').empty();

  taskList.forEach(task => {
    const taskCard = createTaskCard(task);
    if (task.status === 'To Do') {
      $('#todo-cards').append(taskCard);
    } else if (task.status === 'In Progress') {
      $('#in-progress-cards').append(taskCard);
    } else if (task.status === 'Done') {
      $('#done-cards').append(taskCard);
    }
  });

  $(".task-card").draggable({
    revert: "invalid",
    stack: ".task-card",
    zIndex: 100
  });

  $(".lane").droppable({
    accept: ".task-card",
    hoverClass: "ui-droppable-hover",
    drop: handleDrop
  });

  $(".delete-btn").click(handleDeleteTask);
}

// Handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  const title = $('#task-title').val();
  const description = $('#task-desc').val();
  const dueDate = $('#task-due-date').val();
  const newTask = {
    id: generateTaskId(),
    title,
    description,
    dueDate,
    status: 'To Do'
  };
  taskList.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", JSON.stringify(nextId));
  renderTaskList();
  $('#formModal').modal('hide');
}

// Handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(event.target).closest('.task-card').data('id');
  taskList = taskList.filter(task => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.data('id');
  const newStatus = $(this).attr('id').replace('-cards', '').replace('todo', 'To Do').replace('in-progress', 'In Progress').replace('done', 'Done');
  taskList = taskList.map(task => {
    if (task.id === taskId) {
      task.status = newStatus;
    }
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Initialize the app
$(document).ready(function () {
  renderTaskList();
  $('#task-due-date').datepicker();
  $('#add-task-form').submit(handleAddTask);
});