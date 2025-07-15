import React from "react"

export default function ToDoCard(props) {
  const { children, handleDeleteTodos, index, handleEditTodos } = props;
  return (
    <li className="todoItem">
     <i class="fa-regular fa-hand-point-right"></i> {children}
      <div className="actionsContainer">
        <button onClick={() => {
          handleEditTodos(index)
          }}>
          <i className="fa-solid fa-pen-to-square"></i>
        </button>
        <button onClick={() => {
          handleDeleteTodos(index)
          }}>
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>
    </li>
  );
}
