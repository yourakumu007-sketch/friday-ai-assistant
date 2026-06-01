import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Check } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { useAPI } from '../hooks/useAPI';
import { Task } from '../types/index';

const TaskManager: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = useAppStore();
  const { createTask, updateTask: updateTaskAPI, deleteTask: deleteTaskAPI, loading } = useAPI();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', priority: 'MEDIUM' });

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const newTask = await createTask(formData.title, '', formData.priority);
      addTask(newTask);
      setFormData({ title: '', priority: 'MEDIUM' });
      setShowForm(false);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleCompleteTask = async (task: Task) => {
    try {
      const updated = await updateTaskAPI(task.id, {
        status: task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED',
      });
      updateTask(updated);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTaskAPI(taskId);
      deleteTask(taskId);
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const priorityColors = {
    HIGH: 'text-red-400',
    MEDIUM: 'text-yellow-400',
    LOW: 'text-green-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary px-4 py-2 inline-flex items-center gap-2"
        >
          <Plus size={20} /> New Task
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreateTask}
          className="bg-dark-800 p-4 rounded-lg mb-6 space-y-4"
        >
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Task title..."
            className="input-field"
            required
          />
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="input-field"
          >
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {/* Task List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-dark-500 text-center py-8">No tasks yet. Create one to get started!</p>
        ) : (
          tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-dark-800 p-4 rounded-lg flex items-center gap-4 hover:bg-dark-700 transition-colors"
            >
              <button
                onClick={() => handleCompleteTask(task)}
                className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                  task.status === 'COMPLETED'
                    ? 'bg-green-500 border-green-500'
                    : 'border-dark-600 hover:border-primary-500'
                }`}
              >
                {task.status === 'COMPLETED' && <Check size={16} className="text-white" />}
              </button>
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    task.status === 'COMPLETED' ? 'line-through text-dark-500' : ''
                  }`}
                >
                  {task.title}
                </p>
                <p className={`text-xs ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                  {task.priority}
                </p>
              </div>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-dark-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default TaskManager;
