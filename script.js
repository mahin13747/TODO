let tasks = [];
let completedTasks = [];

document.getElementById('add-task').addEventListener('click', addTask);

function addTask(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const deadline = document.getElementById('deadline').value;
    const priority = document.getElementById('priority').value;
    const category = document.getElementById('category').value;

    const task = {
        title,
        description,
        deadline,
        priority,
        category,
        completed: false
    };

    tasks.push(task);
    renderTasks();
    document.getElementById('task-form').reset();

    // Alert box with task details and deadline time
    const deadlineDate = new Date(task.deadline);
    const deadlineTime = deadlineDate.toLocaleTimeString();
    const deadlineDateTime = deadlineDate.toLocaleString();
    alert(`Task created: ${task.title}\nDescription: ${task.description}\nDeadline: ${deadlineDateTime}`);
}

function renderTasks() {
    const taskList = document.getElementById('tasks');
    taskList.innerHTML = '';

    tasks.forEach((task) => {
        const taskElement = document.createElement('li');
        taskElement.className = `task ${task.priority}`;
        taskElement.innerHTML = `
            <span>${task.title}</span>
            <span>${task.description}</span>
            <span>Deadline: ${task.deadline}</span>
            <button class="complete-task">Complete</button>
        `;
        taskList.appendChild(taskElement);

        const completeTaskButton = taskElement.querySelector('.complete-task');
        completeTaskButton.addEventListener('click', () => {
            task.completed = true;
            completedTasks.push(task);
            tasks = tasks.filter((t) => t !== task);
            renderTasks();
            renderCompletedTasks();
        });

        // Check if deadline is approaching
        const deadlineDate = new Date(task.deadline);
        const today = new Date();
        const difference = deadlineDate - today;
        if (difference < 86400000 && difference > 0) {
            taskElement.classList.add('deadline-approaching');
            const timeRemaining = Math.floor(difference / 1000 / 60 / 60);
            alert(`Deadline approaching for task: ${task.title} in ${timeRemaining} hours!`);
        }
    });
}

function renderCompletedTasks() {
    const completedTaskList = document.getElementById('completed-tasks');
    completedTaskList.innerHTML = '';

    completedTasks.forEach((task) => {
        const taskElement = document.createElement('li');
        taskElement.className = `completed-task ${task.priority}`;
        taskElement.innerHTML = `
            <span>${task.title}</span>
            <span>${task.description}</span>
            <span>Deadline: ${task.deadline}</span>
        `;
        completedTaskList.appendChild(taskElement);
    });
}