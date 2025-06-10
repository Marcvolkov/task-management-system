// src/components/tasks/TaskItem.js - Modern task item component
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaClock, FaCheckCircle, FaPlay, FaPause, FaFlag } from 'react-icons/fa';
import { updateTask, deleteTask, toggleTaskSelection } from '../../redux/slices/taskSlice';
import { useTheme } from '../../contexts/ThemeContext';

const TaskItem = ({ task }) => {
  const dispatch = useDispatch();
  useTheme();
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
        return <FaPause size={12} />;
      case 'in_progress':
        return <FaPlay size={12} />;
      case 'completed':
        return <FaCheckCircle size={12} />;
      default:
        return <FaClock size={12} />;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <FaFlag size={12} />;
      case 'medium':
        return <FaFlag size={12} />;
      case 'low':
        return <FaFlag size={12} />;
      default:
        return <FaFlag size={12} />;
    }
  };


  if (isEditing) {
    return (
      <div className="mb-3 scale-in">
        <div 
          className="card-modern p-4"
          style={{ 
            borderLeft: `4px solid ${task.priority === 'high' ? 'var(--error-color)' : task.priority === 'medium' ? 'var(--warning-color)' : 'var(--success-color)'}`,
            background: 'var(--surface-color)'
          }}
        >
          <div className="d-flex align-items-center mb-3">
            <div style={{
              background: 'var(--accent-gradient)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '0.75rem'
            }}>
              <FaEdit size={14} color="white" />
            </div>
            <h6 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>
              Edit Task
            </h6>
          </div>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold" style={{ color: 'var(--text-secondary)' }}>
                Title
              </Form.Label>
              <Form.Control
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                placeholder="Enter task title"
                style={{
                  backgroundColor: 'var(--border-light)',
                  color: 'var(--text-primary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  transition: 'all var(--transition-base)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary-color)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-color)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold" style={{ color: 'var(--text-secondary)' }}>
                Description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="Enter task description (optional)"
                style={{
                  backgroundColor: 'var(--border-light)',
                  color: 'var(--text-primary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  fontSize: '0.95rem',
                  transition: 'all var(--transition-base)',
                  resize: 'vertical'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary-color)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-color)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </Form.Group>

            <div className="row g-3 mb-4">
              <div className="col-sm-6">
                <Form.Label className="fw-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Status
                </Form.Label>
                <Form.Select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  style={{
                    backgroundColor: 'var(--border-light)',
                    color: 'var(--text-primary)',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    fontSize: '0.95rem'
                  }}
                >
                  <option value="pending">📋 Pending</option>
                  <option value="in_progress">▶️ In Progress</option>
                  <option value="completed">✅ Completed</option>
                </Form.Select>
              </div>
              <div className="col-sm-6">
                <Form.Label className="fw-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Priority
                </Form.Label>
                <Form.Select
                  value={editData.priority}
                  onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                  style={{
                    backgroundColor: 'var(--border-light)',
                    color: 'var(--text-primary)',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    fontSize: '0.95rem'
                  }}
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </Form.Select>
              </div>
            </div>

            <div className="d-flex gap-3">
              <button 
                type="button" 
                className="btn-gradient d-flex align-items-center"
                onClick={handleSaveEdit}
                style={{ flex: 1 }}
              >
                <FaCheck className="me-2" />
                Save Changes
              </button>
              <button 
                type="button" 
                onClick={handleCancelEdit}
                style={{
                  background: 'var(--border-light)',
                  border: '2px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--error-color)';
                  e.target.style.color = 'white';
                  e.target.style.borderColor = 'var(--error-color)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--border-light)';
                  e.target.style.color = 'var(--text-secondary)';
                  e.target.style.borderColor = 'var(--border-color)';
                }}
              >
                <FaTimes className="me-2" />
                Cancel
              </button>
            </div>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3 fade-in">
      <div 
        className={`card-modern hover-lift position-relative ${isSelected ? 'selected-task' : ''}`}
        style={{
          borderLeft: `4px solid ${task.priority === 'high' ? 'var(--error-color)' : task.priority === 'medium' ? 'var(--warning-color)' : 'var(--success-color)'}`,
          background: isSelected ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))' : 'var(--surface-color)',
          border: isSelected ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
          overflow: 'hidden',
          transition: 'all var(--transition-base)'
        }}
      >
        {/* Selection Indicator */}
        {isSelected && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'var(--primary-gradient)'
          }}></div>
        )}

        <div className="p-4">
          <div className="d-flex align-items-start">
            {/* Custom Checkbox */}
            <div 
              onClick={handleSelectToggle}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: `2px solid ${isSelected ? 'var(--primary-color)' : 'var(--border-color)'}`,
                background: isSelected ? 'var(--primary-gradient)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginRight: '1rem',
                marginTop: '0.125rem',
                transition: 'all var(--transition-base)',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.target.style.borderColor = 'var(--primary-color)';
                  e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.target.style.borderColor = 'var(--border-color)';
                  e.target.style.background = 'transparent';
                }
              }}
            >
              {isSelected && <FaCheck size={12} color="white" />}
            </div>
            
            <div className="flex-grow-1">
              {/* Header Section */}
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 
                    className="mb-1 fw-bold" 
                    style={{ 
                      color: 'var(--text-primary)',
                      fontSize: '1.1rem',
                      textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                      opacity: task.status === 'completed' ? 0.7 : 1
                    }}
                  >
                    {task.title}
                  </h5>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      Created {new Date(task.created_at).toLocaleDateString()}
                    </small>
                    {task.completed_at && (
                      <small style={{ color: 'var(--success-color)', fontSize: '0.8rem' }}>
                        • Completed {new Date(task.completed_at).toLocaleDateString()}
                      </small>
                    )}
                  </div>
                </div>
                
                <div className="d-flex gap-2">
                  {/* Status Badge */}
                  <div 
                    className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill"
                    style={{
                      background: task.status === 'completed' ? 'var(--success-gradient)' : 
                                 task.status === 'in_progress' ? 'var(--primary-gradient)' : 'var(--text-muted)',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}
                  >
                    {getStatusIcon(task.status)}
                    <span className="ms-1">
                      {task.status === 'in_progress' ? 'In Progress' : 
                       task.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  
                  {/* Priority Badge */}
                  <div 
                    className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill"
                    style={{
                      background: task.priority === 'high' ? 'var(--error-gradient)' : 
                                 task.priority === 'medium' ? 'var(--warning-gradient)' : 'var(--success-gradient)',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}
                  >
                    {getPriorityIcon(task.priority)}
                    <span className="ms-1 text-capitalize">{task.priority}</span>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              {task.description && (
                <p 
                  className="mb-3" 
                  style={{ 
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    lineHeight: '1.5',
                    opacity: task.status === 'completed' ? 0.7 : 1
                  }}
                >
                  {task.description}
                </p>
              )}
              
              {/* Action Buttons */}
              <div className="d-flex justify-content-between align-items-center">
                {/* Status Change Buttons */}
                <div className="d-flex gap-1">
                  {task.status !== 'pending' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange('pending')}
                      title="Mark as Pending"
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--text-muted)',
                        color: 'var(--text-muted)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.375rem 0.75rem',
                        cursor: 'pointer',
                        transition: 'all var(--transition-base)',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'var(--text-muted)';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = 'var(--text-muted)';
                      }}
                    >
                      <FaPause size={10} />
                      Pending
                    </button>
                  )}
                  
                  {task.status !== 'in_progress' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange('in_progress')}
                      title="Mark as In Progress"
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--primary-color)',
                        color: 'var(--primary-color)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.375rem 0.75rem',
                        cursor: 'pointer',
                        transition: 'all var(--transition-base)',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'var(--primary-color)';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = 'var(--primary-color)';
                      }}
                    >
                      <FaPlay size={10} />
                      Start
                    </button>
                  )}
                  
                  {task.status !== 'completed' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange('completed')}
                      title="Mark as Completed"
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--success-color)',
                        color: 'var(--success-color)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.375rem 0.75rem',
                        cursor: 'pointer',
                        transition: 'all var(--transition-base)',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'var(--success-color)';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = 'var(--success-color)';
                      }}
                    >
                      <FaCheckCircle size={10} />
                      Complete
                    </button>
                  )}
                </div>
                
                {/* Edit and Delete Buttons */}
                <div className="d-flex gap-1">
                  <button 
                    onClick={handleEdit}
                    title="Edit Task"
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all var(--transition-base)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--primary-color)';
                      e.target.style.color = 'white';
                      e.target.style.borderColor = 'var(--primary-color)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'var(--text-secondary)';
                      e.target.style.borderColor = 'var(--border-color)';
                    }}
                  >
                    <FaEdit size={12} />
                  </button>
                  
                  <button 
                    onClick={handleDelete}
                    title="Delete Task"
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all var(--transition-base)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--error-color)';
                      e.target.style.color = 'white';
                      e.target.style.borderColor = 'var(--error-color)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'var(--text-secondary)';
                      e.target.style.borderColor = 'var(--border-color)';
                    }}
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;