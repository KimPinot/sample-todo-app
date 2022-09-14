import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { NextPage } from "next";
import { setCookie, getCookie } from "cookies-next";

type Todo = {
  todo: string;
  completed: boolean;
  createdAt: number;
};

const Home: NextPage = () => {
  const { register, handleSubmit: onSubmit, reset } = useForm();
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const _todos = getCookie("todos") as string;
    setTodos(_todos ? JSON.parse(_todos) : []);
  }, []);

  const updateTodos = (todo: Todo[]) => setCookie("todos", JSON.stringify(todo));

  const handleSubmit = onSubmit((todo) => {
    setTodos((prev) => {
      const newTodo = [
        ...prev,
        {
          todo: todo.todo,
          completed: false,
          createdAt: +new Date(),
        },
      ];
      updateTodos(newTodo);
      return newTodo;
    });
    reset();
  });

  const handleChecked = (index: number) => {
    setTodos((prev) => {
      const newTodo = [
        ...prev.slice(0, index),
        {
          ...prev[index],
          completed: !prev[index].completed,
        },
        ...prev.slice(index + 1),
      ];
      updateTodos(newTodo);
      return newTodo;
    });
  };

  const handleDelete = (index: number) => {
    setTodos((prev) => {
      const newTodo = [...prev.slice(0, index), ...prev.slice(index + 1)];
      updateTodos(newTodo);
      return newTodo;
    });
  };

  return (
    <div className={"container mx-auto px-4 py-8"}>
      <h1 className={"text-4xl font-bold mb-4"}>Todo App</h1>
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          {...register("todo")}
          type="text"
          className="input input-bordered w-full"
          placeholder="Add Some Todo..."
        />
        <button className="btn btn-primary">추가하기</button>
      </form>
      <div className="flex flex-col gap-4 mt-8">
        {todos
          .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
          .sort((a, b) => +a.completed - +b.completed)
          .map((todo, index) => (
            <div key={+todo.createdAt} className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleChecked(index)}
                className="checkbox"
              />
              <span onClick={() => handleChecked(index)} className="flex-1 cursor-pointer">
                {todo.completed ? <s>{todo.todo}</s> : todo.todo}
              </span>
              <button onClick={() => handleDelete(index)} className="btn btn-square btn-error btn-xs">
                X
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
