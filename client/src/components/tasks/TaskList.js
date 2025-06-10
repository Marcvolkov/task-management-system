// src/components/tasks/TaskList.js - Компонент списка задач
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonGroup } from 'react-bootstrap';
import { FaCheckSquare, FaClock, FaSquare } from 'react-icons/fa';
import { getTasks, bulkUpdateStatus, clearSelection } from '../../redux/slices/taskSlice';
import TaskItem from './TaskItem';
import TaskFilter from './TaskFilter';
import Loader from '../layout/Loader';
import Alert from '../common/Alert';

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, selectedTasks, isLoading, isError, message } = useSelector(
    (state) => state.tasks
  );

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  const handleBulkStatusUpdate = (status) => {
    if (selectedTasks.length === 0) {
      alert('Please select tasks first');
      return;
    }

    if (window.confirm(`Update ${selectedTasks.length} tasks to ${status}?`)) {
      dispatch(bulkUpdateStatus({ taskIds: selectedTasks, status }));
    }
  };

  if (isLoading && tasks.length === 0) {
    return <Loader />;
  }

  return (
    <div>
      <TaskFilter />
      
      {selectedTasks.length > 0 && (
        <div className="mb-3 p-3 glass-card bounce-subtle" style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          borderRadius: 'var(--radius-lg)'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <span className="d-flex align-items-center" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
              <FaCheckSquare className="me-2 pulse-ring" style={{ color: 'var(--primary-color)' }} />
              {selectedTasks.length} task(s) selected
            </span>
            <div className="d-flex gap-2">
              <ButtonGroup size="sm">
                <button
                  className="hover-lift"
                  onClick={() => handleBulkStatusUpdate('pending')}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--text-muted)',
                    color: 'var(--text-muted)',
                    padding: '0.375rem 0.75rem',
                    borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
                    transition: 'all var(--transition-base)',
                    fontSize: '0.875rem',
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
                  <FaClock size={12} /> Pending
                </button>
                <button
                  className="hover-lift"
                  onClick={() => handleBulkStatusUpdate('in_progress')}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--primary-color)',
                    color: 'var(--primary-color)',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '0',
                    transition: 'all var(--transition-base)',
                    fontSize: '0.875rem',
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
                  <FaClock size={12} /> In Progress
                </button>
                <button
                  className="hover-lift"
                  onClick={() => handleBulkStatusUpdate('completed')}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--success-color)',
                    color: 'var(--success-color)',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                    transition: 'all var(--transition-base)',
                    fontSize: '0.875rem',
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
                  <FaCheckSquare size={12} /> Complete
                </button>
              </ButtonGroup>
              <button
                className="hover-scale"
                onClick={() => dispatch(clearSelection())}
                style={{
                  background: 'var(--border-light)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  padding: '0.375rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all var(--transition-base)',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
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
                <FaSquare size={12} /> Clear
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isError && (
        <Alert variant="danger" message={message} dismissible />
      )}
      
      {tasks.length === 0 ? (
        <div className="text-center py-5 fade-in">
          <div className="glass-card p-4" style={{ 
            maxWidth: '400px', 
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <div className="float-animation" style={{
              background: 'var(--accent-gradient)',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <FaClock size={24} color="white" />
            </div>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '1.1rem',
              marginBottom: '0'
            }}>
              No tasks found. Create your first task!
            </p>
          </div>
        </div>
      ) : (
        <div className="stagger-container">
          {tasks.map((task, index) => (
            <div key={task.id} className="stagger-item">
              <TaskItem task={task} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;