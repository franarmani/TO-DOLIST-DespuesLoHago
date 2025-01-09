import React, { useState } from 'react';
import { FaPencilAlt, FaTrash, FaUndo } from 'react-icons/fa';

const TaskItem = ({ task, onDelete, onToggleComplete, onEdit, isCompleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(task.id, editedText);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="task-item">
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className="task-checkbox"
        />
        
        {isEditing ? (
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="edit-input"
          />
        ) : (
          <span className={task.completed ? 'completed-task' : ''}>
            {task.text}
          </span>
        )}
      </div>
      
      <div className="task-actions">
        {!task.completed && (
          <button onClick={handleEdit} className="edit-btn">
            <FaPencilAlt />
          </button>
        )}
        
        <button 
          onClick={() => onDelete(task.id)} 
          className="delete-btn"
        >
          <FaTrash />
        </button>
        
        {isCompleted && (
          <button 
            onClick={() => onToggleComplete(task.id)} 
            className="restore-btn"
          >
            <FaUndo />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskItem; 