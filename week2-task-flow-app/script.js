// State & DOM References
const state = {
    tasks: JSON.parse(localStorage.getItem('taskFlowTasks')) || [],
    nextId: JSON.parse(localStorage.getItem('taskFlowNextId')) || 1
};

