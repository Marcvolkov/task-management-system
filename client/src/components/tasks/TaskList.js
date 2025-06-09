// src/components/tasks/TaskList.js - Компонент списка задач
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup } from 'react-bootstrap';
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
        <div className="mb-3 p-3 bg-light rounded d-flex justify-content-between align-items-center">
          <span>
            <FaCheckSquare className="me-2" />
            {selectedTasks.length} task(s) selected
          </span>
          <div className="d-flex gap-2">
            <ButtonGroup size="sm">
              <Button
                variant="outline-secondary"
                onClick={() => handleBulkStatusUpdate('pending')}
              >
                <FaClock /> Pending
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => handleBulkStatusUpdate('in_progress')}
              >
                <FaClock /> In Progress
              </Button>
              <Button
                variant="outline-success"
                onClick={() => handleBulkStatusUpdate('completed')}
              >
                <FaCheckSquare /> Complete
              </Button>
            </ButtonGroup>
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => dispatch(clearSelection())}
            >
              <FaSquare /> Clear Selection
            </Button>
          </div>
        </div>
      )}
      
      {isError && (
        <Alert variant="danger" message={message} dismissible />
      )}
      
      {tasks.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No tasks found. Create your first task!</p>
        </div>
      ) : (
        <div>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;