// State & DOM References
const state = {
    tasks: JSON.parse(localStorage.getItem('taskFlowTasks')) || [],
    nextId: JSON.parse(localStorage.getItem('taskFlowNextId')) || 1
};

// Retrieve & store DOM Elements
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

// LocalStorage Functions
function saveToLocalStorage() {
    localStorage.setItem('taskFlowTasks', JSON.stringify(state.tasks));
    localStorage.setItem('taskFlowNextId', JSON.stringify(state.nextId));
}

