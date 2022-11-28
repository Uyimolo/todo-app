const getTodos = () => {
  let storedTodos;
  if (localStorage.getItem("storedTodos") === null) {
    storedTodos = [];
  } else {
    storedTodos = JSON.parse(localStorage.getItem("storedTodos"));
  }
  return storedTodos;
};

const addTodo = document.querySelector("#add-todo");
addTodo.addEventListener("change", () => {
  const todoText = addTodo.value;
  const storedTodos = getTodos();
  storedTodos.push({
    id: Date.now(),
    text: todoText,
    isChecked: false,
  });
  localStorage.setItem("storedTodos", JSON.stringify(storedTodos));
  displayTodo(storedTodos);
  addTodo.value = "";
});

const isChecked = () => {
  const storedTodos = getTodos();
  storedTodos.forEach((todo) => {
    const checkList = document.querySelectorAll(".todo-state");
    checkList.forEach((check) => {
      if (Number(check.parentElement.id) === todo.id) {
        todo.isChecked === true
          ? check.classList.add("check-state")
          : check.classList.remove("check-state");
      }
    });
  });
};

const showLeft = () => {
  const status = document.querySelector(".status");
  const uncompleted = getTodos().filter((todo) => todo.isChecked === false);
  if (uncompleted.length < 2) {
    status.textContent = `${uncompleted.length} item left`;
  } else {
    status.textContent = `${uncompleted.length} items left`;
  }
};

window.addEventListener("DOMContentLoaded", showLeft);

const handleChecked = (e) => {
  const check = e.target;
  if (e.target.classList.contains("todo-state")) {
    check.classList.toggle("check-state");
    const id = Number(check.parentElement.id);
    let storedTodos = getTodos();
    storedTodos.forEach((todo) => {
      if (todo.id === id) {
        todo.isChecked = !todo.isChecked;
        console.log(todo.isChecked);
        localStorage.setItem("storedTodos", JSON.stringify(storedTodos));
      }
    });
    console.log(e.target);
  }
};
//dark mode toggler
let modeClass;
const ReturnModeClass = () => modeClass;
const modes = document.querySelectorAll(".mode");
modes.forEach((mode) =>
  mode.addEventListener("click", () => {
    const light = document.querySelectorAll(".light");
    light.forEach((light) => light.classList.toggle("dark"));
    if (modeClass === undefined) {
      modeClass = "dark";
    } else if (modeClass === "dark") {
      modeClass = "light";
    }
    else{
modeClass = "dark"
    }
    ReturnModeClass();
    displayTodo(getTodos())
  })
);

const displayTodo = (todo) => {
  const todos = document.querySelector(".todos");
  todos.innerHTML = todo
    .map((todo) => {
      return `<div class="todo ${ReturnModeClass()}" id=${
        todo.id
      } draggable="true">
    <div class="todo-state"></div>
    <p class="todo-text">${todo.text}</p>
    <p class="delete-todo" >X</p></div>`;
    })
    .join("");
  console.log(modeClass);
  // console.log(todos)
  //added the eventListener for handleCheck here because it was only added on page load and not on new todo nodes
  document
    .querySelectorAll(".todo-state")
    .forEach((state) => state.addEventListener("click", handleChecked));
  isChecked();
  showLeft();
};

document.querySelector(".todos").addEventListener("click", (e) => {
  const toBeDeleted = e.target;
  if (toBeDeleted.classList.contains("delete-todo")) {
    const id = toBeDeleted.parentElement.id;
    const storedTodos = getTodos();
    const UndeletedTodos = storedTodos.filter((todo) => todo.id !== Number(id));
    localStorage.setItem("storedTodos", JSON.stringify(UndeletedTodos));
    toBeDeleted.parentElement.remove();
  }
  showLeft();
});

window.addEventListener("DOMContentLoaded", displayTodo(getTodos()));
window.addEventListener("DOMContentLoaded", isChecked);
//clear uncompleted todos
const getUncompletedTodos = () => {
  const uncompleted = getTodos().filter((todo) => todo.isChecked === false);
  localStorage.setItem("storedTodos", JSON.stringify(uncompleted));
  displayTodo(uncompleted);
  showLeft;
};
document
  .querySelector(".clear-completed")
  .addEventListener("click", getUncompletedTodos);
//filter todos
document.querySelector(".filter").addEventListener("click", (e) => {
  const clicked = e.target;
  console.log(e.target);
  const storedTodos = getTodos();
  let filteredTodos;
  if (clicked.classList.contains("active")) {
    filteredTodos = storedTodos.filter((item) => item.isChecked === false);
  } else if (clicked.classList.contains("completed")) {
    filteredTodos = storedTodos.filter((item) => item.isChecked === true);
  } else if (clicked.classList.contains("all")) {
    filteredTodos = storedTodos;
  }
  displayTodo(filteredTodos);
});

// drag and drop functionality
const dragArea = document.querySelector(".todos");
new Sortable(dragArea, {
  animation: 950,
});
