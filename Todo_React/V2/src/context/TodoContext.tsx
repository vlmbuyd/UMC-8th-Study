import { createContext, useContext, useState } from "react";
import { TTodo } from "../types/todo";

interface ITodoContext {
  todos: TTodo[];
  doneTodos: TTodo[];
  addTodo: (text: string) => void;
  completeTodo: (todo: TTodo) => void;
  deleteTodo: (todo: TTodo) => void;
}

export const TodoContext = createContext<ITodoContext | undefined>(undefined);

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);

  const addTodo = (text: string) => {
    const newTodo: TTodo = {
      id: Date.now(),
      text,
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const completeTodo = (todo: TTodo) => {
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    setDoneTodos((prev) => [...prev, todo]);
  };

  const deleteTodo = (todo: TTodo) => {
    setDoneTodos((prev) => prev.filter((t) => t.id !== todo.id));
  };

  return (
    <TodoContext.Provider
      value={{ todos, doneTodos, addTodo, completeTodo, deleteTodo }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  // context가 없는 경우
  if (!context) {
    throw new Error("useTodo must be used within a TodoProvider");
  }

  // context가 있는 경우
  return context;
};
