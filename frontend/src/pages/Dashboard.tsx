import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';
import { useAuthStore } from '../store/authStore';
import { useTodoStore } from '../store/todoStore';
import { Todo, UpdateTodoRequest } from '../types/api';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { CheckCircle, Filter, RefreshCcw, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const { todos, isLoading, error, fetchTodos, addTodo, updateTodo, deleteTodo } = useTodoStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null);
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        navigate('/login');
      } else {
        await fetchTodos();
      }
    };
    
    verifyAuth();
  }, [checkAuth, navigate, fetchTodos]);
  
  const handleAddTodo = async (data: any) => {
    try {
      await addTodo(data);
      toast.success('Task created successfully!');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };
  
  const handleUpdateTodo = async (id: string, data: UpdateTodoRequest) => {
    try {
      await updateTodo(id, data);
      toast.success('Task updated successfully!');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };
  
  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };
  
  const filteredTodos = todos.filter((todo: Todo) => {
    // Filter by search term
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by completion status
    const matchesCompleted = filterCompleted === null || todo.completed === filterCompleted;
    
    // Filter by priority
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
    
    return matchesSearch && matchesCompleted && matchesPriority;
  });
  
  const resetFilters = () => {
    setSearchTerm('');
    setFilterCompleted(null);
    setFilterPriority('all');
  };
  
  if (!isAuthenticated) {
    return null; // Don't render until auth check is complete
  }
  
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Tasks</h1>
        
        <TodoForm onSubmit={handleAddTodo} />
        
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-grow mr-4">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Filter className="h-4 w-4" />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filter
            </Button>
          </div>
          
          {showFilters && (
            <div className="p-3 bg-gray-50 rounded-md animate-fadeIn">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                  <select
                    value={filterCompleted === null ? 'all' : filterCompleted ? 'completed' : 'active'}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === 'all') setFilterCompleted(null);
                      else if (value === 'completed') setFilterCompleted(true);
                      else setFilterCompleted(false);
                    }}
                    className="border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Priority</label>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value as any)}
                    className="border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="all">All</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div className="flex items-end ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetFilters}
                    leftIcon={<RefreshCcw className="h-4 w-4" />}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center my-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-md">
            {error}
          </div>
        ) : filteredTodos.length > 0 ? (
          <div>
            {filteredTodos.map((todo: Todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={handleUpdateTodo}
                onDelete={handleDeleteTodo}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-gray-300 mx-auto" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {todos.length > 0
                ? 'Try changing your search or filter settings.'
                : "You don't have any tasks yet. Add your first task above!"}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;