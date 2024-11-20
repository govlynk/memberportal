import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Box, Paper, Typography } from '@mui/material';
import { useTodoStore } from '../stores/todoStore';
import { TodoItem } from './TodoItem';

const COLUMN_TITLES = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

function KanbanColumn({ title, todos, status, onEditTodo }) {
  return (
    <Box sx={{ width: '100%', maxWidth: 350 }}>
      <Paper
        sx={{
          p: 2,
          height: '100%',
          bgcolor: 'background.default',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {title} ({todos.length})
        </Typography>
        <Box sx={{ minHeight: 200 }}>
          <SortableContext items={todos.map(todo => todo.id)} strategy={verticalListSortingStrategy}>
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onEdit={onEditTodo} />
            ))}
          </SortableContext>
          {todos.length === 0 && (
            <Box
              sx={{
                height: 100,
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography color="text.secondary">Drop items here</Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export function KanbanBoard({ onEditTodo }) {
  const { todos, reorderTodos } = useTodoStore();
  const [columns, setColumns] = useState({
    todo: [],
    'in-progress': [],
    done: [],
  });

  useEffect(() => {
    const newColumns = {
      todo: todos.filter((t) => t.status === 'todo'),
      'in-progress': todos.filter((t) => t.status === 'in-progress'),
      done: todos.filter((t) => t.status === 'done'),
    };
    setColumns(newColumns);
  }, [todos]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find which column the task is moving from/to
    const activeContainer = Object.keys(columns).find(key =>
      columns[key].some(item => item.id === activeId)
    );
    const overContainer = Object.keys(columns).find(key =>
      columns[key].some(item => item.id === overId)
    ) || over.id;

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      // Same column sorting
      const items = [...columns[activeContainer]];
      const oldIndex = items.findIndex(item => item.id === activeId);
      const newIndex = items.findIndex(item => item.id === overId);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setColumns({
        ...columns,
        [activeContainer]: newItems,
      });

      reorderTodos(
        todos.map(todo => {
          const newItem = newItems.find(item => item.id === todo.id);
          return newItem || todo;
        })
      );
    } else {
      // Moving between columns
      const sourceItems = [...columns[activeContainer]];
      const destItems = [...columns[overContainer]];

      const [movedItem] = sourceItems.splice(
        sourceItems.findIndex(item => item.id === activeId),
        1
      );

      // Update the status of the moved item
      movedItem.status = overContainer;

      // Add to destination column
      destItems.push(movedItem);

      setColumns({
        ...columns,
        [activeContainer]: sourceItems,
        [overContainer]: destItems,
      });

      // Update the store with the new status
      reorderTodos(
        todos.map(todo =>
          todo.id === movedItem.id
            ? { ...todo, status: overContainer }
            : todo
        )
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 3,
          mt: 4,
        }}
      >
        {Object.entries(columns).map(([status, items]) => (
          <KanbanColumn
            key={status}
            status={status}
            title={COLUMN_TITLES[status]}
            todos={items}
            onEditTodo={onEditTodo}
          />
        ))}
      </Box>
    </DndContext>
  );
}