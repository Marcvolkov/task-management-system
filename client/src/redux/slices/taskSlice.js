// src/redux/slices/taskSlice.js - Redux slice для задач
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../services/taskService';

// Async thunks
export const getTasks = createAsyncThunk(
  'tasks/getTasks',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await taskService.getTasks(filters);
      return response;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return rejectWithValue(message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await taskService.createTask(taskData);
      return response;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return rejectWithValue(message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const response = await taskService.updateTask(id, taskData);
      return response;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return rejectWithValue(message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(id);
      return id;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return rejectWithValue(message);
    }
  }
);

export const getStats = createAsyncThunk(
  'tasks/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskService.getStats();
      return response;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return rejectWithValue(message);
    }
  }
);

export const searchTasks = createAsyncThunk(
  'tasks/searchTasks',
  async (query, { rejectWithValue }) => {
    try {
      const response = await taskService.searchTasks(query);
      return response;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return rejectWithValue(message);
    }
  }
);

export const bulkUpdateStatus = createAsyncThunk(
  'tasks/bulkUpdateStatus',
  async ({ taskIds, status }, { rejectWithValue }) => {
    try {
      const response = await taskService.bulkUpdateStatus(taskIds, status);
      return response;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      return rejectWithValue(message);
    }
  }
);

// Slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    selectedTasks: [],
    stats: null,
    filters: {
      status: '',
      priority: '',
    },
    searchQuery: '',
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    toggleTaskSelection: (state, action) => {
      const taskId = action.payload;
      const index = state.selectedTasks.indexOf(taskId);
      if (index === -1) {
        state.selectedTasks.push(taskId);
      } else {
        state.selectedTasks.splice(index, 1);
      }
    },
    clearSelection: (state) => {
      state.selectedTasks = [];
    },
    updateStatsFromTasks: (state) => {
      if (state.tasks.length > 0) {
        const total = state.tasks.length;
        const pending = state.tasks.filter(task => task.status === 'pending').length;
        const in_progress = state.tasks.filter(task => task.status === 'in_progress').length;
        const completed = state.tasks.filter(task => task.status === 'completed').length;
        const high_priority = state.tasks.filter(task => task.priority === 'high').length;
        
        state.stats = {
          total: total.toString(),
          pending: pending.toString(),
          in_progress: in_progress.toString(),
          completed: completed.toString(),
          high_priority: high_priority.toString()
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get tasks
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload.tasks;
        
        // Автоматически обновляем статистику
        if (state.tasks.length > 0) {
          const total = state.tasks.length;
          const pending = state.tasks.filter(task => task.status === 'pending').length;
          const in_progress = state.tasks.filter(task => task.status === 'in_progress').length;
          const completed = state.tasks.filter(task => task.status === 'completed').length;
          const high_priority = state.tasks.filter(task => task.priority === 'high').length;
          
          state.stats = {
            total: total.toString(),
            pending: pending.toString(),
            in_progress: in_progress.toString(),
            completed: completed.toString(),
            high_priority: high_priority.toString()
          };
        }
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks.unshift(action.payload.task);
        state.message = 'Task created successfully';
        
        // Автоматически обновляем статистику
        const total = state.tasks.length;
        const pending = state.tasks.filter(task => task.status === 'pending').length;
        const in_progress = state.tasks.filter(task => task.status === 'in_progress').length;
        const completed = state.tasks.filter(task => task.status === 'completed').length;
        const high_priority = state.tasks.filter(task => task.priority === 'high').length;
        
        state.stats = {
          total: total.toString(),
          pending: pending.toString(),
          in_progress: in_progress.toString(),
          completed: completed.toString(),
          high_priority: high_priority.toString()
        };
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isSuccess = true;
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.task.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload.task;
        }
        state.message = 'Task updated successfully';
        
        // Автоматически обновляем статистику
        const total = state.tasks.length;
        const pending = state.tasks.filter(task => task.status === 'pending').length;
        const in_progress = state.tasks.filter(task => task.status === 'in_progress').length;
        const completed = state.tasks.filter(task => task.status === 'completed').length;
        const high_priority = state.tasks.filter(task => task.priority === 'high').length;
        
        state.stats = {
          total: total.toString(),
          pending: pending.toString(),
          in_progress: in_progress.toString(),
          completed: completed.toString(),
          high_priority: high_priority.toString()
        };
      })
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        state.selectedTasks = state.selectedTasks.filter(
          (id) => id !== action.payload
        );
        state.message = 'Task deleted successfully';
        
        // Автоматически обновляем статистику
        const total = state.tasks.length;
        const pending = state.tasks.filter(task => task.status === 'pending').length;
        const in_progress = state.tasks.filter(task => task.status === 'in_progress').length;
        const completed = state.tasks.filter(task => task.status === 'completed').length;
        const high_priority = state.tasks.filter(task => task.priority === 'high').length;
        
        state.stats = {
          total: total.toString(),
          pending: pending.toString(),
          in_progress: in_progress.toString(),
          completed: completed.toString(),
          high_priority: high_priority.toString()
        };
      })
      // Get stats
      .addCase(getStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
      })
      // Search tasks
      .addCase(searchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload.tasks;
      })
      // Bulk update
      .addCase(bulkUpdateStatus.fulfilled, (state, action) => {
        state.isSuccess = true;
        // Обновляем задачи в state
        action.payload.tasks.forEach((updatedTask) => {
          const index = state.tasks.findIndex(
            (task) => task.id === updatedTask.id
          );
          if (index !== -1) {
            state.tasks[index] = updatedTask;
          }
        });
        state.selectedTasks = [];
        state.message = 'Tasks updated successfully';
        
        // Автоматически обновляем статистику
        const total = state.tasks.length;
        const pending = state.tasks.filter(task => task.status === 'pending').length;
        const in_progress = state.tasks.filter(task => task.status === 'in_progress').length;
        const completed = state.tasks.filter(task => task.status === 'completed').length;
        const high_priority = state.tasks.filter(task => task.priority === 'high').length;
        
        state.stats = {
          total: total.toString(),
          pending: pending.toString(),
          in_progress: in_progress.toString(),
          completed: completed.toString(),
          high_priority: high_priority.toString()
        };
      });
  },
});

export const { reset, setFilters, setSearchQuery, toggleTaskSelection, clearSelection, updateStatsFromTasks } = taskSlice.actions;
export default taskSlice.reducer;