// src/components/tasks/TaskItem.js - Компонент отдельной задачи
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaClock, FaCheckCircle } from 'react-icons/fa';
import { updateTask, deleteTask, toggleTaskSelection } from '../../redux/slices/taskSlice';
import { useTheme } from '../../contexts/ThemeContext'; // Import useTheme

const TaskItem = ({ task }) => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { selectedTasks } = useSelector((state) => state.tasks);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
  });

  const isSelected = selectedTasks.includes(task.id);

  const handleStatusChange = (newStatus) => {
    dispatch(updateTask({ id: task.id, taskData: { status: newStatus } }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
    });
  };

  const handleSaveEdit = () => {
    if (!editData.title.trim()) {
      return;
    }
    dispatch(updateTask({ id: task.id, taskData: editData }));
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task.id));
    }
  };

  const handleSelectToggle = () => {
    dispatch(toggleTaskSelection(task.id));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock />;
      case 'in_progress':
        return <FaClock className="text-primary" />;
      case 'completed':
        return <FaCheckCircle className="text-success" />;
      default:
        return <FaClock />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'in_progress':
        return 'primary';
      case 'completed':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'secondary';
    }
  };

  if (isEditing) {
    return (
      <div className={`mb-3 p-3 card-modern priority-${task.priority}`}>
        <Form>
          <Form.Group className="mb-2">
            <Form.Control
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Task title"
              style={{backgroundColor: 'var(--surface-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)'}}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Control
              as="textarea"
              rows={2}
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              placeholder="Task description"
              style={{backgroundColor: 'var(--surface-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)'}}
            />
          </Form.Group>
          <div className="d-flex gap-2 mb-2">
            <Form.Select
              size="sm"
              value={editData.status}
              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
              style={{backgroundColor: 'var(--surface-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)'}}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </Form.Select>
            <Form.Select
              size="sm"
              value={editData.priority}
              onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
              style={{backgroundColor: 'var(--surface-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)'}}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Form.Select>
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn-gradient" onClick={handleSaveEdit}>
              <FaCheck /> Save
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
              <FaTimes /> Cancel
            </button>
          </div>
        </Form>
      </div>
    );
  }

  return (
    <div className={`card-modern hover-lift mb-3 priority-${task.priority} ${isSelected ? 'gradient-border' : ''}`}>
      <div className="p-3">
        <div className="d-flex align-items-start">
          <Form.Check
            type="checkbox"
            checked={isSelected}
            onChange={handleSelectToggle}
            className="me-3 mt-1"
          />
          
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h5 className="mb-1" style={{color: 'var(--text-primary)'}}>{task.title}</h5>
              <div className="d-flex gap-2">
                <span className={`badge status-${task.status.toLowerCase()}`}>
                  {getStatusIcon(task.status)} {task.status.replace('_', ' ')}
                </span>
                <span className={`badge priority-badge-${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </div>
            </div>
            
            {task.description && (
              <p className="mb-2" style={{color: 'var(--text-secondary)'}}>{task.description}</p>
            )}
            
            <div className="d-flex justify-content-between align-items-center">
               <div className="btn-group" role="group">
                {task.status !== 'pending' && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => handleStatusChange('pending')}
                    title="Mark as Pending"
                  >
                    <FaClock />
                  </button>
                )}
                {task.status !== 'in_progress' && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleStatusChange('in_progress')}
                    title="Mark as In Progress"
                  >
                    <FaClock />
                  </button>
                )}
                {task.status !== 'completed' && (
                  <button
                   type="button"
                    className="btn btn-sm btn-outline-success"
                    onClick={() => handleStatusChange('completed')}
                    title="Mark as Completed"
                  >
                    <FaCheckCircle />
                  </button>
                )}
              </div>
              
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={handleEdit}>
                  <FaEdit />
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
                  <FaTrash />
                </button>
              </div>
            </div>
            
            <small className="mt-2 d-block" style={{color: 'var(--text-muted)'}}>
              Created: {new Date(task.created_at).toLocaleDateString()}
              {task.completed_at && (
                <> | Completed: {new Date(task.completed_at).toLocaleDateString()}</>
              )}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;