// src/components/tasks/TaskFilter.js - Компонент фильтрации задач
import React from 'react';
import { Form, Row, Col, InputGroup, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { setFilters, setSearchQuery, getTasks, searchTasks } from '../../redux/slices/taskSlice';

const TaskFilter = () => {
  const dispatch = useDispatch();
  const { filters, searchQuery } = useSelector((state) => state.tasks);

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    dispatch(setFilters(newFilters));
    dispatch(getTasks(newFilters));
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchTasks(searchQuery));
    } else {
      dispatch(getTasks(filters));
    }
  };

  const clearFilters = () => {
    dispatch(setFilters({ status: '', priority: '' }));
    dispatch(setSearchQuery(''));
    dispatch(getTasks({}));
  };

  const hasActiveFilters = filters.status || filters.priority || searchQuery;

  return (
    <div className="mb-4">
      <Form onSubmit={handleSearch}>
        <Row className="g-3">
          <Col md={4}>
            <Form.Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Col>
          
          <Col md={3}>
            <Form.Select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Form.Select>
          </Col>
          
          <Col md={5}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Button variant="outline-primary" type="submit">
                <FaSearch />
              </Button>
              {hasActiveFilters && (
                <Button variant="outline-secondary" onClick={clearFilters}>
                  <FaTimes /> Clear
                </Button>
              )}
            </InputGroup>
          </Col>
        </Row>
      </Form>
      
      {hasActiveFilters && (
        <div className="mt-2">
          <small className="text-muted">
            <FaFilter className="me-1" />
            Active filters: 
            {filters.status && ` Status: ${filters.status}`}
            {filters.priority && ` Priority: ${filters.priority}`}
            {searchQuery && ` Search: "${searchQuery}"`}
          </small>
        </div>
      )}
    </div>
  );
};

export default TaskFilter;