import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import { IoMdDoneAll } from "react-icons/io";

import "./Todo.css";

function Todo() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(0);
  const [error, setError] = useState(false);
  const changeValue = (event) => {
    setTodo(event.target.value);
    setError(false); // Reset error on input change
  };
  const handleSubmit = (event) => event.preventDefault();
  const addTodo = () => {
    const trimmedTodo = todo.trim();

    // Validation checks
    if (trimmedTodo === "") {
      setError(true);
      toast.error("Todo cannot be empty!");
      return;
    }
    if (trimmedTodo.length < 3) {
      setError(true);
      toast.error("Todo must be at least 3 characters!");
      return;
    }
    if (trimmedTodo.length > 50) {
      setError(true);
      toast.error("Todo cannot exceed 50 characters!");
      return;
    }

    if (editId) {
      const editTodo = todos.find((item) => item.id === editId);
      const updatedTodo = todos.map((item) => {
        return item.id === editTodo.id
          ? { ...item, list: trimmedTodo } // Retain other properties (e.g., status)
          : item;
      });
      setTodos(updatedTodo);
      saveToLocalStorage(updatedTodo); // Save updated todos to local storage
      toast.success("Todo updated successfully!");
      setEditId(0);
      setTodo("");
      return;
    }
    // Check for uniqueness
    const isDuplicate = todos.some(
      (item) => item.list.toLowerCase() === trimmedTodo.toLowerCase()
    );
    if (isDuplicate) {
      toast.error("Todo already exists!");
      return; // Exit the function without adding a duplicate
    }

    // setTodos([...todos, todo]);
    const newTodos = [
      ...todos,
      { list: trimmedTodo, id: Date.now(), status: false },
    ];
    setTodos(newTodos);
    saveToLocalStorage(newTodos); // Save new todos to local storage
    toast.success("Todo added successfully!");
    setTodo("");
  };
  const saveToLocalStorage = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos)); // Save as a JSON string
  };

  const loadFromLocalStorage = () => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos)); // Parse JSON string to object
    }
  };
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
    loadFromLocalStorage(); // Load todos from local storage on component mount
  },[]);
  const handleDelete = (id) => {
    const updatedTodos = todos.filter((item) => item.id !== id);
    setTodos(updatedTodos);
    saveToLocalStorage(updatedTodos); // Save updated todos to local storage
    toast.error("Todo deleted successfully!");
  };
  const handleComplete = (id) => {
    let complete = todos.map((item) => {
      if (item.id === id) {
        return { ...item, status: !item.status };
      }
      return item;
    });
    setTodos(complete);
    // toast.info("Todo marked as complete!");
    saveToLocalStorage(complete); // Save updated todos to local storage
  };
  const handleEdit = (id) => {
    const editTodo = todos.find((item) => item.id === id);
    setTodo(editTodo.list);
    setEditId(editTodo.id);
    // toast.warning("Editing todo...");
  };

  return (
    <div className="container">
      <h2>Plan It. Do It. Done!</h2>
      <form action="" className="form-group" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your todo"
          value={todo}
          onChange={changeValue}
          ref={inputRef}
          autoComplete="off"
        />
        <button type="submit" onClick={addTodo}>
          {editId ? "Edit" : "Add Task"}
        </button>
      </form>
      <div className="list">
        <ul>
          {todos.map((item) => (
            <li key={item.id} className="list-items">
              <div
                className="list-item-list"
                id={item.status ? "list-item" : ""}
              >
                {item.list}
              </div>

              <span>
                <IoMdDoneAll
                  className="list-item-icons"
                  id="complete"
                  onClick={() => handleComplete(item.id)}
                />
                <GrEdit
                  className="list-item-icons"
                  id="edit"
                  onClick={() => handleEdit(item.id)}
                />
                <MdDelete
                  className="list-item-icons"
                  id="delete"
                  onClick={() => handleDelete(item.id)}
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
      <ToastContainer position="top-center" autoClose={1000} />
    </div>
  );
}

export default Todo;
