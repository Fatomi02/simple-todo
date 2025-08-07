import { useEffect, useState } from "preact/hooks";
import axios from "npm:axios";
import {
  CancelIcon,
  CheckIcon,
  TrashIcon,
  EditIcon,
} from "../components/SVG.tsx";

interface Todo {
  _id: string;
  todo: string;
  completed?: boolean;
}

function Todos() {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [editTodoId, setEditTodoId] = useState<string>("");
  const [editedText, setEditedText] = useState<string>("");

  const addTodo = async () => {
    if (todo.trim().length < 5) {
      setError(true);
      return;
    }
    try {
      const response = await axios.post("api/todos", { todo: todo });
      if (response.status === 201) {
        await fetchTodos();
        setTodo("");
      }
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get("api/todos");
      setTodos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const editTodo = async (editTodo: { _id: string; todo: string }) => {
    if (editedText.trim().length < 5) {
      setError(true);
      return;
    }
    try {
      const response = await axios.put(`api/todos`, {
        id: editTodo._id,
        text: editedText === "" ? editTodo.todo : editedText,
      });
      if (response.status === 200) {
        await fetchTodos();
        setTodo("");
      }
      return response;
    } catch (error) {
      throw error;
    } finally {
      setEdit(false);
      setEditTodoId("");
      setEditedText("");
    }
  };

  const deleteTodo = async (todoId: string) => {
    try {
      const response = await axios.delete(`api/todos`, {
        data: { id: todoId },
      });
      if (response.status === 200) {
        await fetchTodos();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const completed = async (todoId: string) => {
    try {
      const response = await axios.patch(`api/todos`, {
        id: todoId,
        completed: true,
      });
      if (response.status === 200) {
        await fetchTodos();
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);
  return (
    <>
      <div className="mt-2 mx-auto max-w-sm w-full">
        <div className="flex items-start justify-center gap-4">
          <div className="space-y-3">
            <input
              type="text"
              id="todo"
              name="todo"
              value={todo}
              onChange={(e) => {
                setTodo(e.currentTarget.value);
                setError(false);
              }}
              placeholder="Enter new todo..."
              className={`w-full rounded-md py-1.5 px-3.5 ring-1 ring-inset outline-none ring-gray-300 placeholder:text-gray-400 ${
                error && !editTodoId ? "!ring-red-500" : ""
              }`}
              required
            />
            {error && !editTodoId && (
              <small className="text-red-500">
                Todo must be at least 5 characters long.
              </small>
            )}
          </div>
          <button
            type="button"
            onClick={addTodo}
            className="px-4 py-2.5 rounded-md shadow-md bg-lime-600 text-white text-sm font-medium"
          >
            <CheckIcon />
          </button>
        </div>
      </div>
      <div className="mt-10">
        {todos.length > 0 &&
          todos.map((todo: Todo) => {
            return (
              <div
                key={todo._id}
                className={`mb-4 pr-5 lg:pr-10 rounded-md py-3 bg-gray-100 flex justify-between items-center content-between ${
                  todo.completed ? "line-through bg-green-400" : ""
                }`}
              >
                <p className="px-6 w-[75%] break-words whitespace-normal">
                  {todo.todo}
                </p>
                <div className="flex items-start gap-4">
                  {todo._id !== editTodoId && !todo.completed && (
                    <button
                      type="button"
                      onClick={() => {
                        setEdit(true);
                        setEditTodoId(todo._id);
                        setEditedText(todo.todo);
                      }}
                      className="px-3 flex py-2 bg-stone-200 rounded-md shadow-md justify-center items-center"
                    >
                      <EditIcon />
                    </button>
                  )}
                  {edit && todo._id === editTodoId && (
                    <div className="flex items-start gap-4">
                      <div className="space-y-2">
                        <input
                          type="text"
                          id="editTodo"
                          name="editTodo"
                          value={editedText}
                          onChange={(e) => {
                            setEditedText(e.currentTarget.value);
                            setError(false);
                          }}
                          placeholder="Update todo..."
                          className={`w-full rounded-md py-1.5 px-3.5 ring-1 ring-inset outline-none ring-gray-300 placeholder:text-gray-400 ${
                            error ? "!ring-red-500" : ""
                          }`}
                          required
                        />
                        {error && (
                          <small className="text-red-500">
                            Todo must be at least 5 characters long.
                          </small>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => editTodo(todo)}
                        className="px-4 py-2.5 rounded-md shadow-md bg-lime-600 text-white text-sm font-medium"
                      >
                        <CheckIcon />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEdit(false);
                          setEditTodoId("");
                          setError(false);
                        }}
                        className="px-4 py-2.5 shadow-md rounded-md bg-red-600 text-white text-sm font-medium"
                      >
                        <CancelIcon />
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteTodo(todo._id)}
                    className="px-3 py-2 bg-red-600 flex justify-center items-center rounded-md shadow-md"
                  >
                    <TrashIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => completed(todo._id)}
                    className="px-3 py-2 bg-green-600 flex justify-center items-center rounded-md shadow-md"
                  >
                    <CheckIcon />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default Todos;
