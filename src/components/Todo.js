import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
export const Todo = ({task, deleteTodo, editTodo, toggleComplete}) => {
 
  return (
    <div className="Todo">
        <p className={`${task.completed ? 'completed' : ""}`} onClick={() => toggleComplete(task.id)}>{task.task}</p>
        <div>
        <FontAwesomeIcon className="editIcon" icon={faPenToSquare} onClick={() => editTodo(task.id)} />
        <FontAwesomeIcon className="deleteIcon" icon={faTrash} onClick={() => deleteTodo(task.id)} />
        </div>
    </div>
  )
}
