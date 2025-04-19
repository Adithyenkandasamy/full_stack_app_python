import React, { useState } from 'react';
import Button from './ui/Button';
import { CreateTodoRequest } from '../types/api';
import { PlusCircle } from 'lucide-react';

interface TodoFormProps {
  onSubmit: (data: CreateTodoRequest) => Promise<void>;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setIsExpanded(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error instanceof Error ? error.message : 'Failed to create todo');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 animate-slideUp">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center mb-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task..."
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 mr-2"
            onFocus={() => setIsExpanded(true)}
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            leftIcon={<PlusCircle className="h-4 w-4" />}
            className="whitespace-nowrap"
          >
            {isExpanded ? 'Add Task' : 'Add'}
          </Button>
        </div>

        {isExpanded && (
          <div className="space-y-3 animate-fadeIn">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
              rows={2}
            />

            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-700 mr-2">
                Priority:
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="ml-auto text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default TodoForm;