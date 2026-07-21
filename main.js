// setup variable in tag HTML
let inputText = document.getElementById("task-text");
let addTaskElement = document.getElementById("add-task");
let divWriteTask = document.querySelector(".write-task");
let divCounter = document.querySelectorAll(".counters div span");
let allDeleteButton = document.querySelector(".delete-all");
let toggleButton = document.querySelector(".toggle");

let divBox = document.createElement("div");
divBox.classList.add("box");

window.onload = () => inputText.focus();

// check if found localStorge
if (!localStorage.key("tasks")) localStorage.setItem("tasks", "[]");

// add task in localStorge
addTaskElement.addEventListener("click", addTask);
inputText.addEventListener("keydown", (event) => {
  // if Press Button
  if (event.key === "Enter") {
    event.preventDefault();
    addTask();
  }
});

let tasksString = localStorage.getItem("tasks");

tasksJson = JSON.parse(tasksString) || [];

function addTask() {
  // This Condition Is Check Feild Not Empty
  if (inputText.value != "") {
    // Store The Text And Is Task Completed For Store In LocalStorge Later.......
    let taskCurrent = { task: inputText.value, completed: false };

    // Store Task Current In JSON
    tasksJson.push(taskCurrent);
    tasksString = JSON.stringify(tasksJson);

    // Store Task Current In LocalStorge
    localStorage.setItem("tasks", tasksString);

    // Add Task To tasks Displayed In User Interface
    retreveTasks([taskCurrent]);
    inputText.value = "";
  } else {
    Swal.fire({
      title: "Feild Empty",
      text: "Must Fill The Feild At Least One Letter",
      icon: "error",
    }).then(() => {
      inputText.focus();
    });
  }
}

retreveTasks(tasksJson);

// Retreve All Tasks Saved Or Stored In LocalStorge
function retreveTasks(data) {
  for (let i = 0; i < data.length; i++) {
    let divBoxTask = document.createElement("div");
    divBoxTask.classList.add("box-task");

    let divWrite = document.createElement("div");
    divWrite.classList.add("write");
    divWrite.textContent = data[i].task;

    let divDelete = document.createElement("div");
    divDelete.classList.add("delete");
    divDelete.textContent = "Delete";

    divBox.append(divBoxTask);
    divBoxTask.append(divWrite, divDelete);

    divWriteTask.insertAdjacentElement("afterend", divBox);

    divCounter[0].textContent = tasksJson.length;

    FinshedTask(divBoxTask, false);

    divDelete.addEventListener("click", async () => {
      if (await sweetAlert()) {
        deleteTask(divBoxTask);
      }
    });

    divWrite.addEventListener("click", () => {
      FinshedTask(divBoxTask, true);
    });
  }
}

// if Click On Button Delete All Tasks
allDeleteButton.onclick = async () => {
  let length = JSON.parse(localStorage.getItem("tasks")).length
  
  if(length > 0 && await sweetAlert()){
  localStorage.clear();
  tasksJson = [];
  divBox.innerHTML = "";
  divBox.remove();
  divCounter[0].textContent = 0;
  divCounter[1].textContent = 0;
  changeIconComplet();
  }

};

// if Click On Button Toggle
toggleButton.onclick = () => {
  let allDone = tasksJson.every((t) => t.completed);

  tasksJson.forEach((task) => {
    task.completed = !allDone;
  });

  localStorage.setItem("tasks", JSON.stringify(tasksJson));

  divBox.innerHTML = "";
  retreveTasks(tasksJson);
};

function deleteTask(divBoxTask) {
  let allTasks = document.querySelectorAll(".box-task");

  let index = Array.from(allTasks).indexOf(divBoxTask);

  divBoxTask.remove();
  tasksJson.splice(index, 1);

  localStorage.setItem("tasks", JSON.stringify(tasksJson));

  if (tasksJson.length === 0) divBox.remove();
  divCounter[0].textContent = tasksJson.length;

  CalculateTaskCompleted();
  changeIconComplet();
}

function FinshedTask(divBoxTask, isClick) {
  let allTasks = document.querySelectorAll(".box-task");
  let index = Array.from(allTasks).indexOf(divBoxTask);
  let divWrite = divBoxTask.children[0];

  if (!tasksJson[index].completed && isClick === true) {
    active(index, divBoxTask, divWrite);
  } else {
    let delElement = divBoxTask.querySelector(".write del");
    if (!isClick && tasksJson[index].completed) {
      active(index, divBoxTask, divWrite);
    } else if (isClick === true) {
      removeActive(index, delElement, divWrite);
    }
    CalculateTaskCompleted();
  }
  changeIconComplet();
}

// Wrap Task Text In <del> After Click (Only If Task Is Not Completed Or Deleted)
function active(index, task, divWrite) {
  let delElement = document.createElement("del");
  let text = divWrite.textContent;
  divWrite.textContent = "";

  delElement.textContent = text;
  task.children[0].append(delElement);

  tasksJson[index].completed = true;
  localStorage.setItem("tasks", JSON.stringify(tasksJson));

  CalculateTaskCompleted();
}

// Remove <del> Tag And Restore Normal Text When Click Completed Task
function removeActive(index, delElement, divWrite) {
  let text = delElement.textContent;
  divWrite.textContent = text;
  delElement.remove();
  tasksJson[index].completed = false;
  localStorage.setItem("tasks", JSON.stringify(tasksJson));
  CalculateTaskCompleted();
}

function CalculateTaskCompleted() {
  let countCompleted = 0;
  tasksJson.forEach((object) => {
    object.completed ? countCompleted++ : countCompleted;
  });
  divCounter[1].textContent = countCompleted;
}

// Update Toggle Icon Appearance Based On All Tasks Are Completed
function changeIconComplet() {
  console.log("i'mhere");
  let tasksJson = JSON.parse(localStorage.getItem("tasks")) || [];

  let isTrue = tasksJson.every((el) => {
    return el.completed;
  });
  iconCompletedButton = document.querySelector(".buttons div:last-child i");

  // If All Tasks Finshed (Completed)
  if (isTrue && tasksJson.length >= 1) {
    iconCompletedButton.classList.remove("fa-regular", "fa-circle");
    iconCompletedButton.classList.add("fa-solid", "fa-check-circle");
  } else {
    iconCompletedButton.classList.remove("fa-solid", "fa-check-circle");
    iconCompletedButton.classList.add("fa-regular", "fa-circle");
  }
}

async function sweetAlert() {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  });

  if (result.isConfirmed) {
    await Swal.fire({
      title: "Deleted!",
      icon: "success",
    });

    return true;
  }

  return false;
}
