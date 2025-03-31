import { TTodo } from "../types/todo";

interface TodoListProps {
  title: string;
  todos: TTodo[];
  buttonLabel: string;
  buttonColor: string;
  onClick: (todo: TTodo) => void;
}

export default function TodoList({
  title,
  todos,
  buttonLabel,
  buttonColor,
  onClick,
}: TodoListProps) {
  return (
    <div className="render-container__section">
      <h2 className="render-container__title">{title}</h2>
      <ul id="todo-list" className="render-container__list">
        {todos.map((todo) => (
          <li key={todo.id} className="render-container__item">
            <span className="render-container__item-text">{todo.text}</span>
            <button
              style={{ backgroundColor: buttonColor }}
              className="render-container__item-button"
              onClick={() => onClick(todo)}
            >
              {buttonLabel}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
