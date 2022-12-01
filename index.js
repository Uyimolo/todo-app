//retrieve array of todos from local storage
const getTodos = () => {
  let storedTodos;
  if (localStorage.getItem("storedTodos") === null) {
    storedTodos = [];
  } else {
    storedTodos = JSON.parse(localStorage.getItem("storedTodos"));
  }
  return storedTodos;
};

//add todo to array of todos in local storage
const addTodo = document.querySelector("#add-todo");
addTodo.addEventListener("change", () => {
  const todoText = addTodo.value;
  const storedTodos = getTodos();
  storedTodos.push({
    id: Date.now(),
    todoText,
    isChecked: false,
  });
  localStorage.setItem("storedTodos", JSON.stringify(storedTodos));
  displayTodo(storedTodos);
  addTodo.value = "";
});
//check if todo is checked and add/remove the check-state class (handles UI)
const isChecked = () => {
  const storedTodos = getTodos();
  storedTodos.forEach((todo) => {
    const checkList = document.querySelectorAll(".todo-state");
    checkList.forEach((check) => {
      if (Number(check.parentElement.id) === todo.id) {
        // todo.isChecked === true
        //   ? check.classList.add("check-state")
        //   : check.classList.remove("check-state");
        if (todo.isChecked) {
          check.classList.add("check-state");
          check.nextElementSibling.classList.add("check-state");
          console.log(check.nextElementSibling);
        } else {
          check.classList.remove("check-state");
          check.nextElementSibling.classList.remove("check-state");
        }
      }
    });
  });
};

const handleChecked = (e) => {
  const check = e.target;
  if (e.target.classList.contains("todo-state")) {
    check.classList.toggle("check-state");
    check.nextElementSibling.classList.toggle("check-state");
    const id = Number(check.parentElement.id);
    let storedTodos = getTodos();
    storedTodos.forEach((todo) => {
      if (todo.id === id) {
        todo.isChecked = !todo.isChecked;
        localStorage.setItem("storedTodos", JSON.stringify(storedTodos));
      }
    });
  }
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
//handle check events, showUnchecked and display todos on page load
window.addEventListener("DOMContentLoaded", () => {
  isChecked();
  showLeft();
  displayTodo(getTodos());
});
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
    } else {
      modeClass = "dark";
    }
    displayTodo(getTodos());
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
    <p class="todo-text">${todo.todoText}</p>
    <img src="./todo-app-main/images/icon-cross.svg" class="delete-todo"/></div>`;
    })
    .join("");
  // eventListener for handleCheck
  document
    .querySelectorAll(".todo-state")
    .forEach((state) => state.addEventListener("click", handleChecked));
  isChecked();
  showLeft();
};

//delete todo from DOM and from todo array in local storage
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
  const storedTodos = getTodos();
  let filteredTodos;
  if (clicked.classList.contains("active")) {
    filteredTodos = storedTodos.filter((item) => item.isChecked === false);
    document.querySelector(".all").style.color = "";
  } else if (clicked.classList.contains("completed")) {
    filteredTodos = storedTodos.filter((item) => item.isChecked === true);
  } else if (clicked.classList.contains("all")) {
    filteredTodos = storedTodos;
  }
  displayTodo(filteredTodos);
});

document.querySelectorAll(".filters").forEach((filter) =>
  filter.addEventListener("click", (e) => {
    const alreadyActive = document.querySelectorAll(".filter-active");
    alreadyActive.forEach((active) => {
      if (active !== e.target) {
        active.classList.remove("filter-active");
      }
    });
    e.target.classList.toggle("filter-active");
  })
);

// drag and drop functionality
const dragArea = document.querySelector(".todos");
new Sortable(dragArea, {
  animation: 550,
});
