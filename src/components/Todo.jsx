import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export const Todo = ({ task, deleteTodo, editTodo, toggleComplete }) => {
  const isDateFormatValid = (dateString) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    return regex.test(dateString);
  };

  const isValid = isDateFormatValid(task.createdAt);
  const createdAtDate = new Date(task.createdAt);
  const day = createdAtDate.getDate();
  const month = createdAtDate.getMonth() + 1; // Months are zero-based, so we add 1
  const year = createdAtDate.getFullYear();

  // Format the date as dd/mm/yyyy
  const formattedDate = `${day < 10 ? "0" + day : day}/${
    month < 10 ? "0" + month : month
  }/${year}`;

  return (
    <div className="Todo">
      <div className="flex-container">
        <p className="task-id">
          #{task.id}{" "}
          {isValid ? (
            <span className="date">{task.createdAt}</span>
          ) : (
            <span className="date">{formattedDate}</span>
          )}
        </p>
      </div>
      <div>
        <FontAwesomeIcon
          className="editIcon"
          icon={faPenToSquare}
          onClick={() => editTodo(task.id)}
        />
        <FontAwesomeIcon
          className="deleteIcon"
          icon={faTrash}
          onClick={() => deleteTodo(task.id)}
        />
      </div>
      <p
        className={`${task.completed ? "completed" : ""}`}
        onClick={() => toggleComplete(task.id)}
      >
        {task.task}
      </p>
    </div>
  );
};
