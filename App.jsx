import React, { useState } from 'react';
import TaskItem from './components/TaskItem';
import './styles/TaskItem.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        text: newTask,
        completed: false
      }]);
      setNewTask('');
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleComplete = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const editTask = (taskId, newText) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, text: newText } : task
    ));
  };

  const filteredTasks = showCompleted
    ? tasks.filter(task => task.completed)
    : tasks.filter(task => !task.completed);

  return (
    <div className="app">
      <h1>Lista de Tareas</h1>
      
      <form onSubmit={addTask}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nueva tarea..."
        />
        <button type="submit">Agregar</button>
      </form>

      <div className="tabs">
        <button 
          onClick={() => setShowCompleted(false)}
          className={!showCompleted ? 'active' : ''}
        >
          Pendientes
        </button>
        <button 
          onClick={() => setShowCompleted(true)}
          className={showCompleted ? 'active' : ''}
        >
          Completadas
        </button>
      </div>

      <div className="tasks-list">
        {filteredTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={deleteTask}
            onToggleComplete={toggleComplete}
            onEdit={editTask}
            isCompleted={showCompleted}
          />
        ))}
      </div>
    </div>
  );
}

export default App; 