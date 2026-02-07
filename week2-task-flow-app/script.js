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
    progress: document.getElementById('progress-count'),
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
        <button class="delete-btn" aria-label="Delete task">
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
    console.log('=== Render Tasks Start ===')
    console.log('All tasks:', state.tasks);

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
    console.log('=== Render Tasks End ===')
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
    return hints[columnId] || 'Empty column';
}

// Task CRUD Operations
function addTask(text, status = 'todo') {
    if (!text.trim()) return;

    const newTask = {
        id: state.nextId++,
        text: text.trim(),
        status: status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: null
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

    const oldTask = state.tasks[taskIndex];
    const isMoveToDone = updates.status === 'done' && oldTask.status !== 'done';
    const isMovingFromDone = updates.status !== 'done' && oldTask.status === 'done';

    const updatedTask = {
        ...oldTask,
        ...updates,
        updatedAt: new Date().toISOString() // Always update timestamp.
    };

    // Track completion time
    if (isMoveToDone) {
        updatedTask.completedAt = new Date().toISOString();
    } else if (isMovingFromDone) {
        updateTask.completedAt = null;
    }

    state.tasks[taskIndex] = updatedTask;
    saveToLocalStorage();
    renderTasks();
}

function deleteTask(id) {
    state.tasks = state.tasks.filter(task => task.id !== id);
    saveToLocalStorage();
    renderTasks();
}

// Drag & Drop
let draggedTask = null;

function handleDragStart(e) {
    draggedTask = this;
    this.classList.add('dragging');

    // Set drag image
    e.dataTransfer.setData('text/plain', this.dataset.id);
    e.dataTransfer.effectAllowed = 'move';

    // Add slight delay for better visuals
    setTimeout(() => {
        this.style.opacity = '0.4';
    }, 0);
}

function handleDragEnd() {
    this.classList.remove('dragging');
    this.style.opacity = '1';
    draggedTask = null;

    // Remove all drag-over classes
    Object.values(columns).forEach(column => {
        column.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    this.classList.add('drag-over');
    e.dataTransfer.dropEffect = 'move';
}

function handleDragLeave() {
    this.classList.remove('drag-over');
}

function handleDrop (e) {
    e.preventDefault();
    this.classList.remove('drag-over');

    if (!draggedTask) return;

    // Get new status from column's data-status attribute
    const newStatus = this.dataset.status;
    const taskId = parseInt(draggedTask.dataset.id);

    // Update task status
    updateTask(taskId, { status: newStatus });
}

// Event listeners
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(taskInput.value);
});

// Set up drag and drop for columns
Object.values(columns).forEach(column => {
    column.addEventListener('dragover', handleDragOver);
    column.addEventListener('dragleave', handleDragLeave);
    column.addEventListener('drop', handleDrop);
})

// Helper functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function init() {
    console.log('🚀 Task Flow App initializing...');
    renderTasks();

    // Focus input on load
    taskInput.focus();

    // Load any existing tasks from localStorage
    if (state.tasks.length > 0) {
        console.log(`Loaded ${state.tasks.length} tasks from storage`)
    }
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);