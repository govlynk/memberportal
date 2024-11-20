import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTodoStore = create(
  persist(
    (set) => ({
      todos: [],
      addTodo: (todoData) => {
        const newTodo = {
          ...todoData,
          tags: Array.isArray(todoData.tags) ? [...todoData.tags] : [],
        };
        set((state) => ({
          todos: [...state.todos, newTodo],
        }));
      },
      updateTodo: (id, updates) => {
        set((state) => ({
          todos: state.todos.map((todo) => {
            if (todo.id === id) {
              return {
                ...todo,
                ...updates,
                tags: Array.isArray(updates.tags) ? [...updates.tags] : todo.tags,
              };
            }
            return todo;
          }),
        }));
      },
      updateTodos: (newTodos) => {
        set({
          todos: newTodos.map(todo => ({
            ...todo,
            tags: Array.isArray(todo.tags) ? [...todo.tags] : [],
          })),
        });
      },
      removeTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },
    }),
    {
      name: 'todo-storage',
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state?.todos) {
          state.todos = state.todos.map(todo => ({
            ...todo,
            tags: Array.isArray(todo.tags) ? [...todo.tags] : [],
          }));
        }
      },
    }
  )
);