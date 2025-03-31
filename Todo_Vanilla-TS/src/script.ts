const todoInput = document.getElementById("todo-input") as HTMLInputElement;
const todoForm = document.getElementById("todo-form") as HTMLFormElement;
const todoList = document.getElementById("todo-list") as HTMLUListElement;
const doneList = document.getElementById("done-list") as HTMLUListElement;

type Todo = {
  id: number;
  text: string;
};

let todos: Todo[] = [];
let doneTasks: Todo[] = [];

// 할 일 렌더링
const renderTasks = (): void => {
  todoList.innerHTML = "";
  doneList.innerHTML = "";

  todos.forEach((todo) => {
    const li = createTodoElement(todo, false);
    todoList.appendChild(li);
  });
  doneTasks.forEach((todo) => {
    const li = createTodoElement(todo, true);
    doneList.appendChild(li);
  });
};

// 텍스트 입력
const getTodoText = (): string => {
  return todoInput.value.trim();
};

// 할 일 추가
const addTodo = (text: string): void => {
  todos.push({ id: Date.now(), text });
  todoInput.value = "";
  renderTasks();
};

// 할 일 상태변경
const completeTodo = (todo: Todo): void => {
  todos = todos.filter((t) => t.id !== todo.id); // 넘겨준 todo값 제외한 나머지 todo 필터링
  doneTasks.push(todo);
  renderTasks();
};

// 할 일 삭제
const deleteTodo = (todo: Todo): void => {
  doneTasks = doneTasks.filter((t) => t.id !== todo.id); // 넘겨준 todo값 제외한 나머지 todo 필터링
  renderTasks();
};

// 할 일 아이템 생성
const createTodoElement = (todo: Todo, isDone: boolean) => {
  const li = document.createElement("li");
  li.classList.add("render-container__item");
  li.textContent = todo.text;

  const button = document.createElement("button");
  button.classList.add("render-container__item-button");

  if (isDone) {
    button.textContent = "삭제";
    button.style.backgroundColor = "#dc3545";
  } else {
    button.textContent = "완료";
    button.style.backgroundColor = "#28a745";
  }

  button.addEventListener("click", () => {
    if (isDone) {
      deleteTodo(todo);
    } else {
      completeTodo(todo);
    }
  });

  li.appendChild(button);
  return li;
};

// 할 일 아이템 이벤트 등록
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = getTodoText();

  if (text) {
    addTodo(text);
  }
});

renderTasks();
