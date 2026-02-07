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

function renderTasks() {

    // Clear all columns
    Object.values(columns).forEach(column => {
        column.innerHTML = '';
        const hint = document.createElement('p');
        hint.className = 'empty-column-hint';
        hint.textContent = getHintForColumn(column.id);
        column.appendChild(hint);
    });

    // Add tasks to their columns
    state.tasks.forEach(task => {
        const column = columns[task.status];
        const hint = column.querySelector('.empty-column-hint');

        if (hint) column.removeChild(hint);

        const taskEl = createTaskElement(task);
        column.appendChild(taskEl);
    })

    updateCounts();
}

function updateCounts () {
    const counts = { todo: 0, progress: 0, done: 0 };

    state.tasks.forEach(task => {
        counts[task.status]++;
    });

    countElements.todo.textContent = counts.todo;
    countElements.progress.textContent = counts.progress;
    countElements.done.textContent = counts.done;
}

function getHintForColumn(columnId) {
    const hints = {
        'todo-tasks': 'Drag tasks here or add a new one above.',
        'progress-tasks': 'Drag tasks here when you start working.',
        'done-tasks': 'Completed tasks appear here.'
    };
    return hint[columnId] || 'Empty column';
}

// Task CRUD Operations
function addTask(text, status = 'todo') {
    if (!text.trim()) return;

    const newTask = {
        id: state.nextId++,
        text: text.trim(),
        status: status,
        createdAt: new Date().toISOString()
    };

    state.tasks.push(newTask);
    saveToLocalStorage();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
}

function updateTask(id, updates) {
    const taskIndex = state.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return;

    state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates };
    saveToLocalStorage();
    renderTasks();
}

function deleteTask(id) {
    state.tasks = state.tasks.filter(task => task.id !== id);
    saveToLocalStorage();
    renderTasks();
}

