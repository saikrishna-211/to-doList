document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    let editMode = null;

    loadTasks();

    addTaskBtn.addEventListener("click", function () {
        if (editMode) {
            updateTask();
        } else {
            addTask();
        }
    });

    taskInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            if (editMode) {
                updateTask();
            } else {
                addTask();
            }
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === "") return;

        const li = createTaskElement(taskText, false);
        taskList.appendChild(li);
        saveTasks();
        taskInput.value = "";
    }

    function createTaskElement(taskText, completed) {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = taskText;
        span.classList.add("task-text");
        if (completed) span.classList.add("task-completed");
        li.appendChild(span);

        li.classList.add(completed ? "checked" : "unchecked");
        li.addEventListener("click", toggleTask);

        const editBtn = document.createElement("button");
        editBtn.textContent = "✏";
        editBtn.classList.add("editBtn", "small-btn");
        editBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            editTask(li, span.textContent);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "&#10006;";
        deleteBtn.classList.add("deleteBtn", "small-btn");
        deleteBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            li.remove();
            saveTasks();
        });

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        return li;
    }

    function toggleTask(event) {
        if (event.target.tagName === "BUTTON") return;
        this.classList.toggle("checked");
        this.classList.toggle("unchecked");
        this.querySelector("span").classList.toggle("task-completed");
        saveTasks();
    }

    function editTask(li, text) {
        taskInput.value = text;
        editMode = li;
        addTaskBtn.textContent = "Update";
    }

    function updateTask() {
        if (!editMode) return;
        const newText = taskInput.value.trim();
        if (newText === "") return;

        editMode.querySelector(".task-text").textContent = newText;
        saveTasks();

        taskInput.value = "";
        editMode = null;
        addTaskBtn.textContent = "Add";
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll("#taskList li").forEach(li => {
            tasks.push({
                text: li.querySelector(".task-text").textContent,
                completed: li.classList.contains("checked"),
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        savedTasks.forEach(task => {
            const li = createTaskElement(task.text, task.completed);
            taskList.appendChild(li);
        });
    }
});
