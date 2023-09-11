class Task {
    constructor(taskName, dueDate, priority) {
        this.taskName = taskName;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
    }

    getTaskDetail() {
        return `${this.taskName} (Due: ${this.dueDate}, Priority: ${this.priority})`;
    }

    toggleCompletion() {
        this.completed = !this.completed;
    }
}
let taskList = [];

function addTask(...tasks) {
    taskList.push(...tasks);
}

function deleteLastTask() {
    taskList.pop();
}

function addTaskToFront(...tasks) {
    taskList.unshift(...tasks);
}

function deleteFirstTask() {
    taskList.shift();
}

function TaskOperations() {
    let totalTasks = 0;

    return {
        getTotalTasks: () => totalTasks,
        addTask: (task) => {
            totalTasks++;
            addTask(task);
        },
        deleteTask: (taskName) => {
            const index = taskList.findIndex(task => task.taskName === taskName);
            if (index !== -1) {
                totalTasks--;
                taskList.splice(index, 1);
            }
        }
    };
}
const taskOperations = TaskOperations();

function saveTasks() {
    return new Promise((resolve, reject) => {
        const serializedTasks = JSON.stringify(taskList);
        localStorage.setItem('tasks', serializedTasks);
        resolve();
    });
}

async function loadTasks() {
    return new Promise((resolve, reject) => {
        const serializedTasks = localStorage.getItem('tasks');
        if (serializedTasks) {
            taskList = JSON.parse(serializedTasks);
            resolve();
        } else {
            reject();
        }
    });
}

const taskNameInput = document.getElementById('taskName');
const dueDateInput = document.getElementById('dueDate');
const priorityInput = document.getElementById('priority');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskListContainer = document.getElementById('taskList');

function renderTasks() {
    taskListContainer.innerHTML = '';
    taskList.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = `task ${task.completed ? 'completed' : ''}`;
        taskItem.innerHTML = `
            <span>${task.getTaskDetail()}</span>
            <button class="deleteTaskBtn">Delete</button>
        `;
        const deleteTaskBtn = taskItem.querySelector('.deleteTaskBtn');
        deleteTaskBtn.addEventListener('click', () => {
            taskOperations.deleteTask(task.taskName);
            renderTasks();
        });
        taskItem.addEventListener('click', () => {
            task.toggleCompletion();
            renderTasks();
        });
        taskListContainer.appendChild(taskItem);
    });
}

function addTaskUI() {
    const taskName = taskNameInput.value;
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;
    
    if (taskName && dueDate && priority) {
        const task = new Task(taskName, dueDate, priority);
        taskOperations.addTask(task);
        taskNameInput.value = '';
        dueDateInput.value = '';
        priorityInput.value = 'low';
        saveTasks().then(() => {
            renderTasks();
        });
    }
}

addTaskBtn.addEventListener('click', addTaskUI);

loadTasks().then(() => {
    renderTasks();
});
