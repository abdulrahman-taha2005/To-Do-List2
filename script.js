const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const emptyState = document.getElementById("emptyState");
const prioritySelect = document.getElementById("priority");
const themeBtn = document.getElementById("themeBtn");

let currentFilter = "all";

// Add Task

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(e){

  if(e.key === "Enter"){
    addTask();
  }

});

// Theme

themeBtn.addEventListener("click", () => {

  document.body.classList.toggle("light");

});

// Add Task Function

function addTask(){

  const text = taskInput.value.trim();

  const priority = prioritySelect.value;

  if(text === ""){
    alert("Please enter a task!");
    return;
  }

  createTask(text, priority);

  taskInput.value = "";

  saveTasks();

  updateStats();

  checkEmpty();

}

// Create Task

function createTask(text, priority, completed = false){

  const li = document.createElement("li");

  li.className = "task";

  li.dataset.priority = priority;

  if(completed){
    li.classList.add("completed");
  }

  li.innerHTML = `

    <div class="task-left">

      <div class="check"></div>

      <span class="task-text">${text}</span>

      <span class="priority ${priority}">
        ${priority}
      </span>

    </div>

    <div class="task-buttons">

      <button class="delete-btn">
        <i class="fa-solid fa-trash"></i>
      </button>

    </div>

  `;

  // Complete

  li.querySelector(".check").addEventListener("click", () => {

    li.classList.toggle("completed");

    saveTasks();

    updateStats();

    filterTasks(currentFilter);

  });

  // Delete

  li.querySelector(".delete-btn").addEventListener("click", () => {

    li.remove();

    saveTasks();

    updateStats();

    checkEmpty();

  });

  taskList.appendChild(li);

}

// Filters

document.querySelectorAll(".filter-btn").forEach(btn => {

  btn.addEventListener("click", () => {

    document.querySelectorAll(".filter-btn").forEach(b => {
      b.classList.remove("active");
    });

    btn.classList.add("active");

    currentFilter = btn.dataset.filter;

    filterTasks(currentFilter);

  });

});

function filterTasks(filter){

  const tasks = document.querySelectorAll(".task");

  tasks.forEach(task => {

    switch(filter){

      case "completed":
        task.style.display =
        task.classList.contains("completed")
        ? "flex"
        : "none";
      break;

      case "pending":
        task.style.display =
        !task.classList.contains("completed")
        ? "flex"
        : "none";
      break;

      default:
        task.style.display = "flex";

    }

  });

}

// Stats

function updateStats(){

  const all = document.querySelectorAll(".task").length;

  const completed =
  document.querySelectorAll(".task.completed").length;

  totalTasks.innerText = all;

  completedTasks.innerText = completed;

}

// Empty State

function checkEmpty(){

  if(document.querySelectorAll(".task").length === 0){
    emptyState.style.display = "block";
  }

  else{
    emptyState.style.display = "none";
  }

}

// Save Tasks

function saveTasks(){

  const tasks = [];

  document.querySelectorAll(".task").forEach(task => {

    tasks.push({

      text:
      task.querySelector(".task-text").innerText,

      priority:
      task.dataset.priority,

      completed:
      task.classList.contains("completed")

    });

  });

  localStorage.setItem("advancedTasks", JSON.stringify(tasks));

}

// Load Tasks

function loadTasks(){

  const saved =
  JSON.parse(localStorage.getItem("advancedTasks")) || [];

  saved.forEach(task => {

    createTask(
      task.text,
      task.priority,
      task.completed
    );

  });

  updateStats();

  checkEmpty();

}

loadTasks();