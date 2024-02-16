
import "./Todo.css";
import { useState, useEffect } from "react";

const TodoApp = () => {
   const [taskInput, setTaskInput] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todo-list'));
    if (storedTodos) {
      setTodos(storedTodos);
    }
  }, []);
  const saveToLocalStorage = () => {
    localStorage.setItem('todo-list', JSON.stringify(todos));
    console.log('Saved to Local Storage:', todos); 
  };
  
  const showTodo = (filter) => {
    let liTag = '';
    if (todos) {
      todos.forEach((todo, id) => {
        let completed = todo.status === 'completed' ? 'checked' : '';
        if (filter === todo.status || filter === 'all') {
          liTag += (
            <li className="task" key={id}>
              <label htmlFor={id}>
                <input
                  onClick={() => updateStatus(id)}
                  type="checkbox"
                  id={id}
                  checked={completed !== ''}
                />
                <p className={completed}>{todo.name}</p>
              </label>
              <div className="settings">
                <i onClick={() => showMenu(id)} className="uil uil-ellipsis-h"></i>
                <ul className="task-menu">
                  <li onClick={() => editTask(id, todo.name)}>
                    <i className="uil uil-pen"></i>Edit
                  </li>
                  <li onClick={() => deleteTask(id, filter)}>
                    <i className="uil uil-trash"></i>Delete
                  </li>
                </ul>
              </div>
            </li>
          );
        }
      });
    }

    return (
      <ul className="task-box">
        {liTag || <span> you dont have any task here</span>}
      </ul>
    );
  };

  const showMenu = (selectedTask) => {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", (e) => {
      if (e.target.tagName !== "I" || e.target !== selectedTask) {
        menuDiv.classList.remove("show");
      }
    });
  };

const updateStatus = (selectedTask) => {
  const updatedTodos = [...todos];
  updatedTodos[selectedTask].status =
    updatedTodos[selectedTask].status === 'completed' ? 'pending' : 'completed';
  setTodos(updatedTodos);
  saveToLocalStorage();
};

  const editTask = (taskId, textName) => {
    setTaskInput(textName);
  };

  const deleteTask = (deleteId) => {
    const updatedTodos = todos.filter((_, id) => id !== deleteId);
    setTodos(updatedTodos);
    saveToLocalStorage();
  };
  

  const clearAll = () => {
    setTodos([]);
    saveToLocalStorage();
  };

  const handleInputChange = (e) => {
    setTaskInput(e.target.value);
  };

  const handleInputKeyUp = (e) => {
    try {
      let userTask = taskInput.trim();
      if (e.key === 'Enter' && userTask) {
        const updatedTodos = [...todos];
        updatedTodos.push({ name: userTask, status: 'pending' });
        console.log('Updated Todos:', updatedTodos); 
        setTaskInput('');
        setTodos(updatedTodos);
        saveToLocalStorage();
      }
    } catch (error) {
      console.error('Error during task addition:', error);
    }
  };
  
 

  return (
    <div className="wrapper">
      <div className="task-input">
        <input
          type="text"
          placeholder="Add a new task"
          value={taskInput}
          onChange={handleInputChange}
          onKeyUp={handleInputKeyUp}
        />
      </div>

      <div className="controls">
        <div className="filters">
          <span className="active" onClick={() => showTodo('all')}>
            All
          </span>
          <span onClick={() => showTodo('pending')}>Pending</span>
          <span onClick={() => showTodo('completed')}>Completed</span>
        </div>
        <button className="clear-btn" onClick={clearAll}>
          Clear All
        </button>
      </div>

      {showTodo('all')}
    </div>
  );
};

export default TodoApp;
