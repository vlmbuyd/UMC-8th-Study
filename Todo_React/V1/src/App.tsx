import { useState } from "react";

type Todo = {
  id: number;
  text: string;
  done: boolean;
};

function App() {
  const [inputValue, setInputValue] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text: inputValue, done: false },
    ]);

    setInputValue("");
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value);
  };

  const handleTodoStatus = (
    event: React.MouseEvent<HTMLButtonElement>,
    idx: number
  ) => {
    const buttonText = event.currentTarget.textContent;

    if (buttonText === "완료") {
      const newTodos = [...todos];
      newTodos[idx].done = true;
      setTodos(newTodos);
    } else if (buttonText === "삭제") {
      setTodos((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-dvw h-screen bg-amber-50">
      <div className="w-[350px] bg-white">
        <h1>UMC TODO</h1>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={inputValue}
            placeholder="할 일 입력"
            type="text"
            onChange={handleChange}
            className="flex-1 bg-white border border-solid border-gray-300 rounded-[8px]"
          />
          <button
            type="submit"
            className="bg-green-700 text-white px-2 py-2 rounded-[8px] cursor-pointer"
          >
            할 일 추가
          </button>
        </form>

        <div className="flex gap-3">
          <div className="flex flex-col justify-start items-center flex-1">
            <h2>할일</h2>
            <ul className="flex flex-col gap-4 w-full">
              {todos.map(
                (todo, idx) =>
                  !todo.done && (
                    <li
                      key={idx}
                      className="w-full flex justify-between items-center"
                    >
                      {todo.text}
                      <button
                        type="button"
                        className="px-2 py-3 bg-[green] text-white rounded-[8px] cursor-pointer"
                        onClick={(e) => handleTodoStatus(e, idx)}
                      >
                        완료
                      </button>
                    </li>
                  )
              )}
            </ul>
          </div>
          <div className="flex flex-col justify-start items-center flex-1">
            <h2>완료</h2>
            <ul className="flex flex-col gap-4 w-full">
              {todos.map(
                (todo, idx) =>
                  todo.done && (
                    <li
                      key={idx}
                      className="w-full flex justify-between items-center"
                    >
                      {todo.text}
                      <button
                        type="button"
                        className="px-2 py-3 bg-[red] text-white rounded-[8px] cursor-pointer"
                        onClick={(e) => handleTodoStatus(e, idx)}
                      >
                        삭제
                      </button>
                    </li>
                  )
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
