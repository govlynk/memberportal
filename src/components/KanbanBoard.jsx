import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { useTodoStore } from '../stores/todoStore';
import { TodoItem } from './TodoItem';
import { EmptyColumn } from './EmptyColumn';

const COLUMNS = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

const getColumnColors = (mode) => ({
  todo: {
    default: mode === 'dark' ? 'grey.900' : 'grey.50',
    hover: mode === 'dark' ? 'grey.800' : 'grey.100',
  },
  'in-progress': {
    default: mode === 'dark' ? '#1a365d' : 'info.50',
    hover: mode === 'dark' ? '#1e4976' : 'info.100',
  },
  done: {
    default: mode === 'dark' ? '#1a4731' : 'success.50',
    hover: mode === 'dark' ? '#1e5738' : 'success.100',
  },
});

function DroppableColumn({ status, title, todos, onEditTodo, activeId }) {
  const theme = useTheme();
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  const COLUMN_COLORS = getColumnColors(theme.palette.mode);
  const isActiveContainer = todos.some(todo => todo.id === activeId);

  return (
    <Box 
      ref={setNodeRef}
      sx={{ 
        width: '100%', 
        maxWidth: 350,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isOver ? 'scale(1.02)' : 'none',
      }}
    >
      <Paper 
        sx={{ 
          p: 2, 
          height: '100%',
          bgcolor: isOver ? COLUMN_COLORS[status].hover : COLUMN_COLORS[status].default,
          borderRadius: 2,
          minHeight: 200,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          outline: isOver ? '2px dashed' : isActiveContainer ? '2px solid' : 'none',
          outlineColor: 'primary.main',
          boxShadow: isOver ? 4 : 1,
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            fontWeight: 600,
            p: 1,
            borderRadius: 1,
            bgcolor: 'background.paper',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'all 0.2s ease',
            boxShadow: isOver ? 1 : 0,
          }}
        >
          {title}
          <Typography 
            component="span" 
            sx={{ 
              ml: 1,
              px: 1.5,
              py: 0.5,
              borderRadius: '12px',
              bgcolor: isOver ? 'primary.main' : theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200',
              color: isOver ? 'primary.contrastText' : 'text.secondary',
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'all 0.2s ease',
            }}
          >
            {todos.length}
          </Typography>
        </Typography>
        <Box 
          sx={{ 
            minHeight: 100,
            transition: 'all 0.2s ease',
            p: 1,
            borderRadius: 1,
            bgcolor: isOver ? (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'action.hover') : 'transparent',
          }}
        >
          {todos.length > 0 ? (
            <SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>
              {todos.map((todo) => (
                <TodoItem 
                  key={todo.id} 
                  todo={todo} 
                  onEdit={onEditTodo}
                  isDragging={todo.id === activeId}
                />
              ))}
            </SortableContext>
          ) : (
            <EmptyColumn status={status} />
          )}
        </Box>
      </Paper>
    </Box>
  );
}

// Rest of the KanbanBoard component remains the same
export function KanbanBoard({ onEditTodo }) {
  const { todos, updateTodos } = useTodoStore();
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    document.body.style.cursor = 'grabbing';
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    document.body.style.cursor = '';

    if (!over) return;

    const activeIndex = todos.findIndex(t => t.id === active.id);
    if (activeIndex === -1) return;

    const newTodos = [...todos];
    const [draggedTodo] = newTodos.splice(activeIndex, 1);

    // If dropping on a column
    const targetStatus = over.id;
    if (Object.keys(COLUMNS).includes(targetStatus)) {
      draggedTodo.status = targetStatus;
      // Add to the end of the target column
      const targetColumnTodos = todos.filter(t => t.status === targetStatus);
      const insertIndex = targetColumnTodos.length > 0 
        ? newTodos.findIndex(t => t.id === targetColumnTodos[targetColumnTodos.length - 1].id) + 1
        : newTodos.length;
      newTodos.splice(insertIndex, 0, draggedTodo);
    } 
    // If dropping on another todo
    else {
      const overIndex = todos.findIndex(t => t.id === over.id);
      if (overIndex === -1) return;

      // If same column, just reorder
      if (draggedTodo.status === todos[overIndex].status) {
        newTodos.splice(overIndex, 0, draggedTodo);
      } 
      // If different column, change status and insert
      else {
        draggedTodo.status = todos[overIndex].status;
        newTodos.splice(overIndex, 0, draggedTodo);
      }
    }

    updateTodos(newTodos);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    document.body.style.cursor = '';
  };

  const todosByStatus = Object.keys(COLUMNS).reduce((acc, status) => {
    acc[status] = todos.filter(todo => todo.status === status);
    return acc;
  }, {});

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 3,
          mt: 4,
        }}
      >
        {Object.entries(COLUMNS).map(([status, title]) => (
          <DroppableColumn
            key={status}
            status={status}
            title={title}
            todos={todosByStatus[status]}
            onEditTodo={onEditTodo}
            activeId={activeId}
          />
        ))}
      </Box>
    </DndContext>
  );
}