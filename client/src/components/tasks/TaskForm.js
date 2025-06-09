// src/components/tasks/TaskForm.js - Компонент формы создания задачи
import React, { useState } from 'react';
import { Form, Button, Card, Badge } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import { createTask } from '../../redux/slices/taskSlice';

// Функция для парсинга быстрых команд
const parseQuickCommands = (text) => {
  const commands = {
    '!high': { priority: 'high' },
    '!low': { priority: 'low' },
    '!bug': { priority: 'high', category: 'bug' },
    '!meeting': { priority: 'medium', category: 'meeting' },
    '!urgent': { priority: 'high' }
  };

  let cleanTitle = text;
  const params = { priority: 'medium' }; // дефолтный приоритет

  // Ищем команды в тексте
  Object.keys(commands).forEach(command => {
    if (text.includes(command)) {
      // Удаляем команду из текста
      cleanTitle = cleanTitle.replace(new RegExp(command, 'g'), '').trim();
      // Применяем параметры команды
      Object.assign(params, commands[command]);
    }
  });

  // Убираем лишние пробелы
  cleanTitle = cleanTitle.replace(/\s+/g, ' ').trim();

  return {
    title: cleanTitle,
    ...params
  };
};

const TaskForm = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
  });

  const { title, description, priority } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prevState) => {
      const newState = {
        ...prevState,
        [name]: value,
      };
      
      // Если изменяется title, парсим команды и обновляем приоритет
      if (name === 'title') {
        const parsed = parseQuickCommands(value);
        if (parsed.priority && parsed.priority !== prevState.priority) {
          newState.priority = parsed.priority;
        }
      }
      
      return newState;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    // Парсим быстрые команды из заголовка
    const parsedCommands = parseQuickCommands(title);
    
    // Создаем задачу с обработанными данными
    const taskData = {
      ...formData,
      title: parsedCommands.title,
      priority: parsedCommands.priority || formData.priority,
      ...(parsedCommands.category && { category: parsedCommands.category })
    };

    dispatch(createTask(taskData));
    
    // Сброс формы
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
    });
    setShowForm(false);
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
    });
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <Button
        variant="primary"
        onClick={() => setShowForm(true)}
        className="mb-4 w-100"
      >
        <FaPlus className="me-2" />
        Add New Task
      </Button>
    );
  }

  return (
    <Card className="mb-4 shadow-sm fade-in">
      <Card.Body>
        <h5 className="mb-3">Create New Task</h5>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
              autoFocus
            />
            <small className="text-muted">
              Tip: Use !high for high priority, !bug for bugs, !meeting for meetings, !low for low priority, !urgent for urgent tasks
            </small>
            {formData.priority === 'high' && (
              <div className="mt-2">
                <Badge bg="danger">High Priority</Badge>
              </div>
            )}
            {formData.priority === 'low' && (
              <div className="mt-2">
                <Badge bg="success">Low Priority</Badge>
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={description}
              onChange={handleChange}
              placeholder="Enter task description (optional)"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              name="priority"
              value={priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="primary" type="submit">
              Create Task
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default TaskForm;