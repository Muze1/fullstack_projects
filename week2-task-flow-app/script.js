// State & DOM References
const state = {
    tasks: JSON.parse(localStorage.getItem('taskFlowTasks')) || [], // Persists data across page refreshes.
    nextId: JSON.parse(localStorage.getItem('taskFlowNextId')) || 1 // Prevents ID conflicts
};

// Retrieve & organise DOM Elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const columns = {
    todo: document.getElementById('todo-tasks'),
    progress: document.getElementById('progress-tasks'),
    done: document.getElementById('done-tasks')
};
const countElements = {
    todo: document.getElementById('todo-count'),
    progress: document.getElementById('progress-tasks'),
    done: document.getElementById('done-count')
};

// Local storage Functions
function saveToLocalStorage() {
    localStorage.setItem('taskFlowTasks', JSON.stringify(state.tasks));
    localStorage.setItem('taskFlowNextId', JSON.stringify(state.nextId));
    // .stringify() - Turn objects into strings for localStorage.
    // Separate keys for tasks and nextId.
}

// Task Rendering & UI
function createTaskElement(task) {
    const taskEl = document.createElement('div');
    taskEl.className = 'task';
    taskEl.draggable = true; // Enable native drag in HTML for drag&drop.
    taskEl.dataset.id = task.id;
    taskEl.dataset.status = task.status;

    taskEl.innerHTML = `
    <div class="task-content" contenteditable="true">${escapeHtml(task.text)}</div>
    <div class="task-actions">
        <button class=delete-btn" aria-label="Delete task">
            <i class="fas fa-trash"></i>
        </button>
    </div>
    `;


    // Add event listeners to the new task
    const contentDiv = taskEl.querySelector('.task-content');
    const deleteBtn = taskEl.querySelector('.delete-btn');

    // Save on edit
    contentDiv.addEventListener('blur', () => {
        updateTask(task.id, { text: contentDiv.textContent });
    });

    // Enter key to finish editing
    contentDiv.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            contentDiv.blur();
        }
    });

    // Delete task
    deleteBtn.addEventListener('click', () => {
        deleteTask(task.id);
    });

    // Drag events
    taskEl.addEventListener('dragstart', handleDragStart);
    taskEl.addEventListener('dragend', handleDragEnd);

    return taskEl;
}