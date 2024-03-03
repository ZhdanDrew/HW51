const todosWrapper = document.querySelector("#todos-wrapper");
const todosCount = document.querySelector("#todos-count");

class TodoApplication {
  constructor(todos) {
    this.todos = todos;

    localStorage.setItem("todos", JSON.stringify(todos));

    this.countTodos();
    this.sortTodos();
    this.renderTodos(todos);
  }

  countTodos() {
    const counted = this.todos.reduce(
      (acc, todo) => {
        todo.isDone ? acc.done++ : acc.notDone++;
        return acc;
      },
      { done: 0, notDone: 0 }
    );

    todosCount.textContent = `${counted.done} / ${this.todos.length}`;
    // Завдання: порахуйте зроблені та не зроблені завдання
  }

  sortTodos() {
    this.todos = this.todos.sort((t1, t2) => (t1.isDone ? 1 : -1));
    this.renderTodos(this.todos);

    localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  addTodo(todo) {
    this.todos.push(todo);
    this.renderTodos(this.todos);
    this.countTodos();

    localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  updateTodo(todoToUpdate) {
    this.todos = this.todos.map((todo) =>
      todo.id === todoToUpdate.id ? todoToUpdate : todo
    );

    this.countTodos();
    this.sortTodos();
    this.renderTodos(this.todos);

    localStorage.setItem("todos", JSON.stringify(this.todos));
    // another way
    // const index = this.todos.findIndex((todo) => todo.id === todoToUpdate.id);
    // this.todos[index] = todoToUpdate;
  }

  removeTodo(id) {
    // Видаляємо елемент з масиву за його id
    this.todos = this.todos.filter(todo => todo.id !== id);

    // Перемалюємо елементи
    this.renderTodos(this.todos);

    // Записуємо оновлення у локальне сховище
    localStorage.setItem("todos", JSON.stringify(this.todos));
}


  renderTodos(todos) {
    todosWrapper.innerHTML = "";

    todos.forEach((todo) => {
      const { id, title, isDone } = todo;

      const wrapper = document.createElement("div");
      wrapper.classList.add("todo-item");

      if (isDone) {
        wrapper.classList.add("todo-item-done");
      }

      // checkbox input
      const check = document.createElement("input");
      check.type = "checkbox";
      check.checked = isDone;
      check.onchange = (event) => {
        this.updateTodo({ id, title, isDone: event.target.checked });
      };
      wrapper.appendChild(check);

      // title
      const p = document.createElement("p");
      p.textContent = title;
      wrapper.appendChild(p);

      // delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.onclick = () => {
        this.removeTodo(id, title);
      };
      wrapper.appendChild(deleteButton);

      todosWrapper.appendChild(wrapper);
    });
  }
}

class Todo {
  constructor(id, title, isDone) {
    this.id = id;
    this.title = title;
    this.isDone = isDone;
  }

  update(updates) {
    for (const update in updates) {
      this[update] = updates[update];
    }

    return this;
  }
}

const todosFromLS = JSON.parse(localStorage.getItem("todos")) || [];

const APPLICATION = new TodoApplication(todosFromLS);

const createTodoForm = document.querySelector("#create-todo-form");
const todoInput = document.querySelector("#todo-title");

createTodoForm.onsubmit = (event) => {
  event.preventDefault();


  const todoText = todoInput.value.trim();


  if (todoText === "") {
      return;
  }


  const existingTodo = APPLICATION.todos.find(todo => todo.title === todoText);
  if (existingTodo) {
      alert("Це завдання вже існує в списку!");
      todoInput.value = "";
      return;
  }

  const id = APPLICATION.todos.length;
  const newTodo = new Todo(id, todoText, false);
  APPLICATION.addTodo(newTodo);

  todoInput.value = "";
};