const getTodos = () => {
  let storedTodos;
  if (localStorage.getItem("storedTodos") === null) {
    storedTodos = [];
  } else {
    storedTodos = JSON.parse(localStorage.getItem("storedTodos"));
  }
  return storedTodos;
};

//add todo to local storage
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
  showLeft();
  addTodo.value = "";
});

// show todo
const displayTodo = (todo) => {
  const todos = document.querySelector(".todos");
  todos.innerHTML = todo
    .map((currentTodo) => {
      return `<div class="todo" id=${currentTodo.id}>
            <div class="todo-state"><input type="checkbox" class="check"></div>
            <p class="todo-text">${currentTodo.text}</p>
            <p class="delete-todo" >X</p></div>`;
    })
    .join("");
};

// delete todo
document.querySelector(".todos").addEventListener("click", (e) => {
  const toBeDeleted = e.target;
  if (toBeDeleted.classList.contains("delete-todo")) {
    const id = toBeDeleted.parentElement.id;
    const storedTodos = getTodos();
    const UndeletedTodos = storedTodos.filter((todo) => todo.id !== Number(id));
    localStorage.setItem("storedTodos", JSON.stringify(UndeletedTodos));
    toBeDeleted.parentElement.remove();
  }
  showLeft()

});

window.addEventListener("DOMContentLoaded", displayTodo(getTodos()));

//toggle todo state checked/!checked
const handleCheckState = (e) => {
  const checkbox = e.target;
  const pseudoCheckBox = checkbox.parentElement;
  const id = Number(checkbox.parentElement.parentElement.id);
  // indicate active states
  pseudoCheckBox.classList.toggle("check-state");
  // change checked state in storedTodos
  handleChangeState(id);
};

const handleChangeState = (id) => {
  let storedTodos = getTodos();
  console.log(storedTodos);
  storedTodos.forEach((item) => {
    if (item.id === id) {
      item.isChecked = !item.isChecked;
    }
  });
  localStorage.setItem("storedTodos", JSON.stringify(storedTodos));
  showLeft();
};

const check = document.querySelectorAll(".check").forEach((check) => {
  check.addEventListener("change", handleCheckState);
});

const isChecked = () => {
  const storedTodos = getTodos();
  storedTodos.forEach((todo) => {
    const checkList = document.querySelectorAll(".check");
    checkList.forEach((check) => {
      if (Number(check.parentElement.parentElement.id) === todo.id) {
        check.checked = todo.isChecked;
      }
      check.checked === true
        ? check.parentElement.classList.add("check-state")
        : check.parentElement.classList.remove("check-state");
    });
  });
};

window.addEventListener("DOMContentLoaded", isChecked);

const showLeft = () => {
  const status = document.querySelector(".status");
  const uncompleted = getTodos().filter((todo) => todo.isChecked === false);
  //   if (uncompleted.length === 1) {
  //     status.textContent = "1 item left";
  //   }
  //  else if(uncompleted.length < 1) {
  //   status.textContent = "No item left"
  //   }
  //   else {
  //     status.textContent = `${uncompleted.length} items left`;
  //   }
  status.textContent = `${uncompleted.length} items left`;
};

window.addEventListener("DOMContentLoaded", showLeft);
const getUncompletedTodos = () => {
  const uncompleted = getTodos().filter((todo) => todo.isChecked === false);
  localStorage.setItem("storedTodos", JSON.stringify(uncompleted));
  displayTodo(uncompleted);
  showLeft
};

document
  .querySelector(".clear-completed")
  .addEventListener("click", getUncompletedTodos);

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
  isChecked();
  showLeft();
});

//drag and drop functionality
const dragArea = document.querySelector(".todos");
new Sortable(dragArea, {
  animation: 350,
});
