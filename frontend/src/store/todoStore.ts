import { create } from 'zustand';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/api';
import { createTodo, deleteTodo, getTodos, updateTodo } from '../lib/api';

interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  addTodo: (data: CreateTodoRequest) => Promise<void>;
  updateTodo: (id: string, data: UpdateTodoRequest) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,
  
  fetchTodos: async () => {
    try {
      set({ isLoading: true, error: null });
      const todos = await getTodos();
      set({ todos, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch todos',
        isLoading: false,
      });
    }
  },
  
  addTodo: async (data: CreateTodoRequest) => {
    try {
      set({ isLoading: true, error: null });
      const newTodo = await createTodo(data);
      set(state => ({
        todos: [...state.todos, newTodo],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create todo',
        isLoading: false,
      });
      throw error;
    }
  },
  
  updateTodo: async (id: string, data: UpdateTodoRequest) => {
    try {
      set({ isLoading: true, error: null });
      const updatedTodo = await updateTodo(id, data);
      set(state => ({
        todos: state.todos.map(todo => (todo.id === id ? updatedTodo : todo)),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update todo',
        isLoading: false,
      });
      throw error;
    }
  },
  
  deleteTodo: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await deleteTodo(id);
      set(state => ({
        todos: state.todos.filter(todo => todo.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete todo',
        isLoading: false,
      });
      throw error;
    }
  },
  
  clearError: () => {
    set({ error: null });
  },
}));