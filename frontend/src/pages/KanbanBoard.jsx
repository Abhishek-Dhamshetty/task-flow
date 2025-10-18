import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';
import { useTask } from '../context/TaskContext';
import { projectAPI, taskAPI } from '../services/api';
import { ArrowLeft, Plus, Brain, MessageCircle } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import AISummaryModal from '../components/AISummaryModal';
import AIQuestionModal from '../components/AIQuestionModal';

// Sortable Task Item Component
const SortableTaskItem = ({ task, onEdit, onDelete, getPriorityColor }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`transition-all duration-200 ${isDragging ? 'z-50' : ''}`}
    >
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        getPriorityColor={getPriorityColor}
      />
    </div>
  );
};

// Droppable Column Component
const DroppableColumn = ({ column, tasks, onEdit, onDelete, getPriorityColor, onAddTask }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center">
          {column.name}
          <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </h3>
        <button
          onClick={() => onAddTask(column.name)}
          className="text-gray-400 hover:text-blue-600 transition-colors"
          title={`Add task to ${column.name}`}
        >
          <Plus size={18} />
        </button>
      </div>

      <SortableContext items={tasks.map(task => task._id)} strategy={verticalListSortingStrategy}>
        <div className="min-h-32 space-y-3 p-2 rounded-lg">
          {tasks.map((task) => (
            <SortableTaskItem
              key={task._id}
              task={task}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task._id)}
              getPriorityColor={getPriorityColor}
            />
          ))}
          
          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No tasks yet</p>
              <button
                onClick={() => onAddTask(column.name)}
                className="text-blue-600 hover:text-blue-700 text-sm mt-2"
              >
                Add your first task
              </button>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

const KanbanBoard = () => {
  const { projectId } = useParams();
  const { state, dispatch } = useTask();
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [createTaskStatus, setCreateTaskStatus] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [showAISummary, setShowAISummary] = useState(false);
  const [showAIQuestion, setShowAIQuestion] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    loadProjectAndTasks();
  }, [projectId]);

  const loadProjectAndTasks = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const [projectResponse, tasksResponse] = await Promise.all([
        projectAPI.getById(projectId),
        taskAPI.getByProject(projectId)
      ]);
      
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: projectResponse.data });
      dispatch({ type: 'SET_TASKS', payload: tasksResponse.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the containers
    const activeTask = state.tasks.find(task => task._id === activeId);
    if (!activeTask) return;

    // Check if we're hovering over a different column
    const columns = ['To Do', 'In Progress', 'Done'];
    const overColumn = columns.find(col => overId === col) || 
                      state.tasks.find(task => task._id === overId)?.status;

    if (overColumn && activeTask.status !== overColumn) {
      // Move task to different column
      const updatedTasks = state.tasks.map(task => 
        task._id === activeId 
          ? { ...task, status: overColumn }
          : task
      );
      dispatch({ type: 'SET_TASKS', payload: updatedTasks });
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = state.tasks.find(task => task._id === activeId);
    if (!activeTask) return;

    try {
      // Determine the new status
      const columns = ['To Do', 'In Progress', 'Done'];
      let newStatus = activeTask.status;
      
      // Check if dropped on a column header or another task
      const overColumn = columns.find(col => overId === col);
      if (overColumn) {
        newStatus = overColumn;
      } else {
        const overTask = state.tasks.find(task => task._id === overId);
        if (overTask) {
          newStatus = overTask.status;
        }
      }

      // Update task on server
      await taskAPI.move(activeId, {
        newStatus,
        newOrder: 0 // Simple ordering for now
      });
      
      // Reload tasks to get updated order
      const tasksResponse = await taskAPI.getByProject(projectId);
      dispatch({ type: 'SET_TASKS', payload: tasksResponse.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      // Reload tasks to revert changes
      loadProjectAndTasks();
    }
  };

  const handleCreateTask = (status) => {
    setCreateTaskStatus(status);
    setShowCreateTask(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.delete(taskId);
        dispatch({ type: 'DELETE_TASK', payload: taskId });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    }
  };

  const getTasksByStatus = (status) => {
    return state.tasks
      .filter(task => task.status === status)
      .sort((a, b) => a.order - b.order);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (state.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!state.currentProject) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Project not found</h2>
        <Link to="/" className="text-blue-600 hover:text-blue-700">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const columns = state.currentProject.columns || [
    { name: 'To Do', order: 0 },
    { name: 'In Progress', order: 1 },
    { name: 'Done', order: 2 }
  ];

  const activeTask = activeId ? state.tasks.find(task => task._id === activeId) : null;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Projects
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAIQuestion(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <MessageCircle size={18} />
              <span>Ask AI</span>
            </button>
            <button
              onClick={() => setShowAISummary(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Brain size={18} />
              <span>AI Summary</span>
            </button>
          </div>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{state.currentProject.name}</h1>
          <p className="text-gray-600 mt-2">{state.currentProject.description}</p>
        </div>
      </div>

      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {state.error}
        </div>
      )}

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {columns.sort((a, b) => a.order - b.order).map((column) => (
            <DroppableColumn
              key={column.name}
              column={column}
              tasks={getTasksByStatus(column.name)}
              onEdit={setEditingTask}
              onDelete={handleDeleteTask}
              getPriorityColor={getPriorityColor}
              onAddTask={handleCreateTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              onEdit={() => {}}
              onDelete={() => {}}
              getPriorityColor={getPriorityColor}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modals */}
      {showCreateTask && (
        <CreateTaskModal
          projectId={projectId}
          initialStatus={createTaskStatus}
          onClose={() => {
            setShowCreateTask(false);
            setCreateTaskStatus('');
          }}
          onTaskCreated={(task) => {
            dispatch({ type: 'ADD_TASK', payload: task });
            setShowCreateTask(false);
            setCreateTaskStatus('');
          }}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          projectColumns={columns}
          onClose={() => setEditingTask(null)}
          onTaskUpdated={(task) => {
            dispatch({ type: 'UPDATE_TASK', payload: task });
            setEditingTask(null);
          }}
        />
      )}

      {showAISummary && (
        <AISummaryModal
          projectId={projectId}
          onClose={() => setShowAISummary(false)}
        />
      )}

      {showAIQuestion && (
        <AIQuestionModal
          projectId={projectId}
          onClose={() => setShowAIQuestion(false)}
        />
      )}
    </div>
  );
};

export default KanbanBoard;