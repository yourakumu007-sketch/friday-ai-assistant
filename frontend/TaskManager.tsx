import React, { useState, useEffect, useCallback } from 'react';
import './TaskManager.css';

// Types
interface Task {
  id: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TaskFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
  });

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks?limit=100`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply filters to tasks
  useEffect(() => {
    let filtered = tasks;

    if (filter === 'pending') {
      filtered = filtered.filter(task => !task.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Sort by priority and due date
    filtered.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];

      if (aPriority !== bPriority) return aPriority - bPriority;

      // Sort by due date if priorities are same
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }

      return 0;
    });

    setFilteredTasks(filtered);
  }, [tasks, filter, priorityFilter]);

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add or update task
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
      };

      const url = editingId
        ? `${API_BASE_URL}/api/tasks/${editingId}`
        : `${API_BASE_URL}/api/tasks`;

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Failed to ${editingId ? 'update' : 'create'} task`);

      await fetchTasks();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Complete task
  const handleCompleteTask = async (taskId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/complete`, {
        method: 'PATCH',
      });

      if (!response.ok) throw new Error('Failed to complete task');

      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');

      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Edit task
  const handleEditTask = (task: Task) => {
    setEditingId(task.id);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      due_date: task.due_date ? task.due_date.split('T')[0] : '',
    });
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      due_date: '',
    });
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    resetForm();
    setShowForm(false);
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="task-manager">
      <div className="task-manager-header">
        <h1>📋 Task Manager</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          {showForm ? '✕ Cancel' : '+ New Task'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="due_date">Due Date</label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Saving...' : editingId ? 'Update Task' : 'Add Task'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancelEdit}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="task-filters">
        <div className="filter-group">
          <label>Status:</label>
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <div className="filter-group">
          <label>Priority:</label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {loading && !showForm && <div className="loading">Loading tasks...</div>}

      {!loading && filteredTasks.length === 0 && (
        <div className="empty-state">
          <p>No tasks found. {filter !== 'all' && 'Try adjusting your filters.'}</p>
        </div>
      )}

      <div className="task-list">
        {filteredTasks.map(task => (
          <div key={task.id} className={`task-card priority-${task.priority}`}>
            <div className="task-header">
              <div className="task-title-section">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleCompleteTask(task.id)}
                  className="task-checkbox"
                  disabled={loading}
                />
                <h3 className={task.completed ? 'completed' : ''}>
                  {task.title}
                </h3>
              </div>
              <div className="task-badges">
                <span className={`badge priority-${task.priority}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>
            </div>

            {task.description && (
              <p className="task-description">{task.description}</p>
            )}

            <div className="task-meta">
              <span className="task-date">📅 {formatDate(task.due_date)}</span>
            </div>

            <div className="task-actions">
              <button
                className="btn btn-small btn-edit"
                onClick={() => handleEditTask(task)}
                disabled={loading}
              >
                ✏️ Edit
              </button>
              <button
                className="btn btn-small btn-delete"
                onClick={() => handleDeleteTask(task.id)}
                disabled={loading}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
