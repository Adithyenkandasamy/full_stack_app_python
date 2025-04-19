import React, { useState } from 'react';
import { Todo, UpdateTodoRequest } from '../types/api';
import { CheckCircle, Edit, Trash2, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';
import { cn, formatDate, getPriorityColor } from '../lib/utils';
import Button from './ui/Button';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, data: UpdateTodoRequest) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(todo.priority);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleComplete = async () => {
    try {
      setIsLoading(true);
      await onUpdate(todo.id, { completed: !todo.completed });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      setIsLoading(true);
      await onUpdate(todo.id, { title, description, priority });
      setIsEditing(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await onDelete(todo.id);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getPriorityIcon = () => {
    switch (priority) {
      case 'low':
        return <ArrowDown className="h-4 w-4" />;
      case 'medium':
        return <ArrowRight className="h-4 w-4" />;
      case 'high':
        return <ArrowUp className="h-4 w-4" />;
    }
  };

  return (
    <div className={cn(
      'bg-white rounded-lg shadow-sm p-4 mb-3 border-l-4 animate-slideIn',
      'transition-all duration-200 hover:shadow-md',
      todo.completed ? 'border-green-500 bg-green-50' : 'border-primary-500'
    )}>
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            placeholder="Task title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            placeholder="Description (optional)"
            rows={2}
          />
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Priority:</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="rounded border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleSaveEdit}
              isLoading={isLoading}
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between">
            <div className="flex items-start space-x-3">
              <button 
                onClick={handleToggleComplete}
                disabled={isLoading}
                className="mt-0.5 text-gray-400 hover:text-green-500 transition-colors"
              >
                <CheckCircle 
                  className={cn(
                    "h-5 w-5",
                    todo.completed ? "text-green-500 fill-green-500" : "text-gray-400"
                  )} 
                />
              </button>
              <div>
                <h3 className={cn(
                  "text-lg font-medium",
                  todo.completed ? "text-gray-500 line-through" : "text-gray-900"
                )}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={cn(
                    "text-sm text-gray-500 mt-1",
                    todo.completed ? "line-through" : ""
                  )}>
                    {todo.description}
                  </p>
                )}
                <div className="flex items-center mt-2 space-x-3">
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                    getPriorityColor(todo.priority)
                  )}>
                    {getPriorityIcon()}
                    <span className="ml-1">{todo.priority}</span>
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(todo.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className="text-gray-400 hover:text-primary-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;