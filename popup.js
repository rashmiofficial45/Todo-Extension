document.addEventListener("DOMContentLoaded", () => {
    const draggableContainer = document.getElementById("draggable-container");
    const dragHeader = document.getElementById("drag-header");

    let isDragging = false;
    let offsetX, offsetY;

    // Mouse down: Start dragging
    dragHeader.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - draggableContainer.offsetLeft;
      offsetY = e.clientY - draggableContainer.offsetTop;
      draggableContainer.style.position = "absolute";
      draggableContainer.style.cursor = "move";
    });

    // Mouse move: Move the container
    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        draggableContainer.style.left = `${e.clientX - offsetX}px`;
        draggableContainer.style.top = `${e.clientY - offsetY}px`;
      }
    });

    // Mouse up: Stop dragging
    document.addEventListener("mouseup", () => {
      isDragging = false;
      draggableContainer.style.cursor = "default";
    });

    // Function to handle click outside the window
    function handleClickOutside(e) {
      // Check if the click is outside the draggable container (including the todo list area)
      if (!draggableContainer.contains(e.target)) {
        // Fade the window by reducing opacity slightly
        draggableContainer.style.opacity = '0.7';
        draggableContainer.style.pointerEvents = 'auto'; // Keep the window active for interaction
      }
    }

    // Attach the event listener to detect clicks outside
    document.addEventListener('mousedown', handleClickOutside);

    // Reset opacity when clicking inside the window (inside any area of the window)
    draggableContainer.addEventListener('mousedown', () => {
      draggableContainer.style.opacity = '1';
      draggableContainer.style.pointerEvents = 'auto'; // Keep the window interactive
    });

    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("todo-input");
    const todoList = document.getElementById("todo-list");

    // Fetch tasks from chrome.storage
    chrome.storage.sync.get("todos", (data) => {
      if (data.todos) {
        data.todos.forEach(addTaskToDOM);
      }
    });

    // Save tasks to chrome.storage
    function saveToStorage() {
      const tasks = Array.from(todoList.children).map((li) =>
        li.textContent.replace("Delete", "").trim()
      );
      chrome.storage.sync.set({ todos: tasks });
    }

    // Add task to the DOM
    function addTaskToDOM(task) {
      const li = document.createElement("li");
      li.textContent = task;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        li.remove();
        saveToStorage();
      });

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
  });
