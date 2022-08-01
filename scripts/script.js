// form inputs
const todoInput = document.getElementById('todo');
const dueDateInput = document.getElementById('due-date');

// todo item class
class Todo {
  constructor(todoText, dueDate) {
    this.todoText = todoText;
    this.dueDate = dueDate;
    this.isCompleted = false;
  }
}

// todo list class
class ToDoList {
  constructor(taskContainer) {
    this.tasksArr = JSON.parse(window.localStorage.getItem('tasksArr')) || [];
    this.taskContainer = document.getElementById('todo-container');
    this.updateDom(this.tasksArr);
  }
  // updating the dom with each change
  updateDom(tasksArr) {
    this.taskContainer.innerHTML = '';
    this.addTaskHandler();
    let sortedArr = this.sortArr(tasksArr);
    this.addTasksToDom(sortedArr);
  }

  // adding a new todo
  addTodo(todoItem, dueDateInput) {
    if (todoItem == '') {
      alert('Please add some text');
    } else if (dueDateInput == '') {
      alert('Please add a date');
    } else {
      this.tasksArr.push(new Todo(todoItem, dueDateInput));
      this.setTodoToLocalStorage();
    }
    this.updateDom(this.tasksArr);
  }

  // sort the array alphabetically
  sortArr(tasksArr) {
    tasksArr.sort(function (a, b) {
      let textA = a.todoText.toUpperCase();
      let textB = b.todoText.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    return tasksArr;
  }

  // add the tasks to the dom
  addTasksToDom(tasksArr) {
    const ul = document.createElement('ul');
    ul.className = 'todo-list';

    tasksArr.forEach((task, taskIndex) => {
      const removeItemFromArr = () => {
        this.tasksArr = this.tasksArr.slice(0, taskIndex);
      };

      // create elements needed for todo item
      const li = document.createElement('li');
      const taskSpan = document.createElement('span');
      const dueDateSpan = document.createElement('span');
      const actionsWrapper = document.createElement('div');
      const editIcon = document.createElement('i');
      const completeIcon = document.createElement('i');
      const removeIcon = document.createElement('i');

      taskSpan.innerText = task.todoText;
      dueDateSpan.innerText = task.dueDate;

      li.className = 'card';
      taskSpan.className = 'card-title';
      dueDateSpan.className = 'card-subtitle';
      actionsWrapper.className = 'actions-wrapper';
      editIcon.className = 'fa-solid fa-pen-to-square';
      completeIcon.className = 'fa-solid fa-check';
      removeIcon.className = 'fa-solid fa-trash-can';

      // event to handle to editing an item
      editIcon.addEventListener('click', (event) => {
        todoInput.value = taskSpan.innerText;
        dueDateInput.value = dueDateSpan.innerText;
        ul.removeChild(li);
        removeItemFromArr();
      });

      // event to handle marking item as complete
      completeIcon.addEventListener('click', (event) => {
        li.classList.add('completed-task');
        completeIcon.classList.add('hide-element');
        editIcon.classList.add('hide-element');
        li.style.textDecoration = 'line-through';
        dueDateSpan.style.textDecoration = 'line-through';
        task.isCompleted = true;
        this.setTodoToLocalStorage();
      });

      //event to handle removing an item
      removeIcon.addEventListener('click', () => {
        ul.removeChild(li);
        removeItemFromArr();
        this.setTodoToLocalStorage();
        this.updateDom(this.tasksArr);
      });

      // adding strikethrough if an item is completed
      if (task.isCompleted) {
        li.style.textDecoration = 'line-through';
        completeIcon.classList.add('hide-element');
        editIcon.classList.add('hide-element');
      }

      // appending all the elements
      actionsWrapper.appendChild(editIcon);
      actionsWrapper.appendChild(completeIcon);
      actionsWrapper.appendChild(removeIcon);
      li.appendChild(taskSpan);
      li.appendChild(dueDateSpan);
      li.appendChild(actionsWrapper);
      ul.appendChild(li);
    });

    this.taskContainer.appendChild(ul);
  }

  // handling the form submit
  addTaskHandler() {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.addEventListener('click', (event) => {
      event.stopImmediatePropagation();
      event.preventDefault();
      this.addTodo(todoInput.value, dueDateInput.value);
    });
  }

  // adding the array to local storage
  setTodoToLocalStorage() {
    window.localStorage.setItem('tasksArr', JSON.stringify(this.tasksArr));
  }
}
const todo = new ToDoList();
