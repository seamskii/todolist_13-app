
import React, { useEffect, useState } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { v4 as uuidv4 } from "uuid";
import { EditTodoForm } from "./EditTodoForm";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import TodoDropdowns from "./TodoDropdowns";
import { format } from 'date-fns';


export const TodoWrapper = ({ todos }) => {
  const [todoLocal, setTodoLocal] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("id");
  const [direction, setDirection] = useState("asc");
  const { mutate } = useSWRConfig();

  const fetcher = async () => {
    const response = await axios.get("http://localhost:5000/tasks");
    return response.data;
  };

  const { data } = useSWR("tasks", fetcher);

  useEffect(() => {
    if (data) {
      const updatedData = data.map((element) => ({
        ...element,
        isEditing: false,
      }));
      setTodoLocal(updatedData);
    }
  }, [data]);

  const addTodo = async (task) => {
    try {
      const existingTodo = todoLocal.find((todo) => todo.task === task);
      if (existingTodo) {
        window.alert("Task already exists: " + task);
        return;
      }
  
      await axios.post("http://localhost:5000/tasks", {
        task: task,
        completed: false,
      });
  
      fetchData(); // Fetch updated data with new IDs
  
      const currentDate = new Date();
      const formattedDate = format(currentDate, 'dd/MM/yyyy');
  
      const newTodo = {
        id: uuidv4(),
        task: task,
        completed: false,
        createdAt: formattedDate,
        isEditing: false,
      };
      setTodoLocal([...todoLocal, newTodo]);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };
  

  const deleteTodo = async (id) => {
    try {
      const existingTodo = todoLocal.find((todo) => todo.id === id);
      if (!existingTodo) {
        console.error("Todo not found in local state.");
        return;
      }

      setTodoLocal((prevTodoLocal) =>
        prevTodoLocal.filter((todo) => todo.id !== id)
      );

      await axios.delete(`http://localhost:5000/tasks/${id}`);
      mutate("tasks");
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const todoToUpdate = todoLocal.find((todo) => todo.id === id);
      const completed = !todoToUpdate.completed;

      await axios.patch(`http://localhost:5000/tasks/${id}`, {
        completed: completed,
      });

      setTodoLocal((prevTodoLocal) =>
        prevTodoLocal.map((todo) =>
          todo.id === id ? { ...todo, completed: completed } : todo
        )
      );
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const editTodo = (id) => {
    setTodoLocal((prevTodoLocal) =>
      prevTodoLocal.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  const editTask = async (task, id) => {
    try {
      const existingTodo = todoLocal.find((todo) => todo.id === id);

      await axios.patch(`http://localhost:5000/tasks/${id}`, {
        task: task,
        completed:
          existingTodo.task === task ? existingTodo.completed : false,
      });

      setTodoLocal((prevTodoLocal) =>
        prevTodoLocal.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                task: task,
                completed:
                  existingTodo.task === task ? todo.completed : false,
                isEditing: !todo.isEditing,
              }
            : todo
        )
      );
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const fetchData = async () => {
    const updatedData = await fetcher();
    setTodoLocal((prevTodoLocal) => {
      const updatedTodoLocal = [...prevTodoLocal];

      updatedData.forEach((dataItem) => {
        const existingTodo = updatedTodoLocal.find(
          (todo) => todo.task === dataItem.task
        );
        if (existingTodo) {
          existingTodo.id = dataItem.id;
        }
      });

      return updatedTodoLocal;
    });
  };

  const handleFilterChange = (e) => {
    console.log("filter")
    setFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    console.log("sort")
    setSort(e.target.value);
  };

  const handleDirectionChange = (e) => {
    console.log("direction",e.target.value)
    setDirection(e.target.value);
  };

  const filteredAndSortedTodos = todoLocal
    .filter((todo) => {
      if (filter === "completed") {
        return todo.completed;
      } else if (filter === "uncompleted") {
        return !todo.completed;
      }
      return true;
    })
    .sort((a, b) => {
      let compareValue;
      switch (sort) {
        case "id":
          compareValue = parseInt(a.id) - parseInt(b.id);
          break;
        case "status":
          compareValue = a.completed - b.completed;
          break;
        case "date":
          compareValue = a.createdAt && b.createdAt ? a.createdAt.localeCompare(b.createdAt) : 0;
          break;
        case "description":
          compareValue = (a.description || "").localeCompare(b.description || "");
          break;
        default:
          compareValue = 0;
          break;
      }
      return direction === "asc" ? compareValue : -compareValue;
    });
    
    

  if (!data) return <h2>Loading...</h2>;

  return (
    <div className="TodoWrapper">
      <h1>Get Things Done!</h1>
      <TodoDropdowns
        filter={filter}
        handleFilterChange={handleFilterChange}
        sort={sort}
        handleSortChange={handleSortChange}
        direction={direction}
        handleDirectionChange={handleDirectionChange}
      />
  
      <TodoForm addTodo={addTodo} />
      {filteredAndSortedTodos.map((element) =>
        element.isEditing ? (
          <EditTodoForm key={element.id} editTodo={editTask} task={element} />
        ) : (
          <Todo
            key={element.id}
            task={element}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            toggleComplete={toggleComplete}
          />
        )
      )}
    </div>
  );
};
