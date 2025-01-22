document.addEventListener("DOMContentLoaded", () => {
  const draggableContainer = document.getElementById("draggable-container");
  const dragHeader = document.getElementById("drag-header");

  let isDragging = false;
  let offsetX, offsetY;

  // Dragging functionality
  dragHeader.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - draggableContainer.offsetLeft;
    offsetY = e.clientY - draggableContainer.offsetTop;
    draggableContainer.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;
      const maxLeft = window.innerWidth - draggableContainer.offsetWidth;
      const maxTop = window.innerHeight - draggableContainer.offsetHeight;

      draggableContainer.style.left = `${Math.min(Math.max(0, newLeft), maxLeft)}px`;
      draggableContainer.style.top = `${Math.min(Math.max(0, newTop), maxTop)}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    draggableContainer.style.cursor = "default";
  });

  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");
  const clearAllButton = document.getElementById("clear-all");

  // Save tasks to local storage
  function saveToStorage() {
    const tasks = Array.from(todoList.children).map((li) => li.textContent.replace("Delete", "").trim());
    localStorage.setItem("todos", JSON.stringify(tasks));
  }

  // Add a task to the DOM
  function addTaskToDOM(taskText) {
    const li = document.createElement("li");

    const taskContent = document.createElement("span");
    taskContent.textContent = taskText;
    taskContent.classList.add("task-text");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      li.remove();
      saveToStorage();
    });

    li.appendChild(taskContent);
    li.appendChild(deleteButton);
    todoList.appendChild(li);
  }

  // Handle form submission
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const task = todoInput.value.trim();
    if (task) {
      addTaskToDOM(task);
      saveToStorage();
      todoInput.value = "";
    }
  });

  // Clear all tasks
  clearAllButton.addEventListener("click", () => {
    todoList.innerHTML = "";
    saveToStorage();
  });

  // Load tasks from local storage
  const savedTasks = JSON.parse(localStorage.getItem("todos") || "[]");
  savedTasks.forEach(addTaskToDOM);
});
