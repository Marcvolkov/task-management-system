// src/components/tasks/TaskItem.js - Компонент отдельной задачи
import React, { useState } from 'react';
import { Card, Badge, Button, Form, ButtonGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaClock, FaCheckCircle } from 'react-icons/fa';
import { updateTask, deleteTask, toggleTaskSelection } from '../../redux/slices/taskSlice';

const TaskItem = ({ task }) => {
  const dispatch = useDispatch();
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
      <Card className={`mb-3 shadow-sm priority-${task.priority}`}>
        <Card.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Control
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                placeholder="Task title"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                as="textarea"
                rows={2}
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                placeholder="Task description"
              />
            </Form.Group>
            <div className="d-flex gap-2 mb-2">
              <Form.Select
                size="sm"
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </Form.Select>
              <Form.Select
                size="sm"
                value={editData.priority}
                onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Form.Select>
            </div>
            <div className="d-flex gap-2">
              <Button size="sm" variant="success" onClick={handleSaveEdit}>
                <FaCheck /> Save
              </Button>
              <Button size="sm" variant="secondary" onClick={handleCancelEdit}>
                <FaTimes /> Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className={`mb-3 shadow-sm priority-${task.priority} ${isSelected ? 'border-primary' : ''}`}>
      <Card.Body>
        <div className="d-flex align-items-start">
          <Form.Check
            type="checkbox"
            checked={isSelected}
            onChange={handleSelectToggle}
            className="me-3"
          />
          
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h5 className="mb-1">{task.title}</h5>
              <div className="d-flex gap-2">
                <Badge bg={getStatusVariant(task.status)}>
                  {getStatusIcon(task.status)} {task.status.replace('_', ' ')}
                </Badge>
                <Badge bg={getPriorityVariant(task.priority)}>
                  {task.priority}
                </Badge>
              </div>
            </div>
            
            {task.description && (
              <p className="text-muted mb-2">{task.description}</p>
            )}
            
            <div className="d-flex justify-content-between align-items-center">
              <ButtonGroup size="sm">
                {task.status !== 'pending' && (
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleStatusChange('pending')}
                    title="Mark as Pending"
                  >
                    <FaClock />
                  </Button>
                )}
                {task.status !== 'in_progress' && (
                  <Button
                    variant="outline-primary"
                    onClick={() => handleStatusChange('in_progress')}
                    title="Mark as In Progress"
                  >
                    <FaClock />
                  </Button>
                )}
                {task.status !== 'completed' && (
                  <Button
                    variant="outline-success"
                    onClick={() => handleStatusChange('completed')}
                    title="Mark as Completed"
                  >
                    <FaCheckCircle />
                  </Button>
                )}
              </ButtonGroup>
              
              <div className="d-flex gap-2">
                <Button size="sm" variant="outline-primary" onClick={handleEdit}>
                  <FaEdit />
                </Button>
                <Button size="sm" variant="outline-danger" onClick={handleDelete}>
                  <FaTrash />
                </Button>
              </div>
            </div>
            
            <small className="text-muted">
              Created: {new Date(task.created_at).toLocaleDateString()}
              {task.completed_at && (
                <> | Completed: {new Date(task.completed_at).toLocaleDateString()}</>
              )}
            </small>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TaskItem;