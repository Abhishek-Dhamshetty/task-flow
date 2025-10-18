import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTask } from '../context/TaskContext';
import { projectAPI, taskAPI } from '../services/api';
import { ArrowLeft, Plus, Brain, MessageCircle } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import AISummaryModal from '../components/AISummaryModal';
import AIQuestionModal from '../components/AIQuestionModal';

const KanbanBoard = () => {
  const { projectId } = useParams();
  const { state, dispatch } = useTask();
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [createTaskStatus, setCreateTaskStatus] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [showAISummary, setShowAISummary] = useState(false);
  const [showAIQuestion, setShowAIQuestion] = useState(false);

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

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    try {
      await taskAPI.move(draggableId, {
        newStatus: destination.droppableId,
        newOrder: destination.index
      });
      
      // Reload tasks to get updated order
      const tasksResponse = await taskAPI.getByProject(projectId);
      dispatch({ type: 'SET_TASKS', payload: tasksResponse.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {columns.sort((a, b) => a.order - b.order).map((column) => (
            <div key={column.name} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  {column.name}
                  <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {getTasksByStatus(column.name).length}
                  </span>
                </h3>
                <button
                  onClick={() => handleCreateTask(column.name)}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  title={`Add task to ${column.name}`}
                >
                  <Plus size={18} />
                </button>
              </div>

              <Droppable 
                droppableId={column.name}
                isDropDisabled={false}
                isCombineEnabled={false}
                ignoreContainerClipping={false}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-32 space-y-3 p-2 rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-blue-200 border-dashed' : ''
                    }`}
                  >
                    {getTasksByStatus(column.name).map((task, index) => (
                      <Draggable 
                        key={task._id} 
                        draggableId={task._id} 
                        index={index}
                        isDragDisabled={false}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transition-transform ${
                              snapshot.isDragging ? 'rotate-2 shadow-lg scale-105' : ''
                            }`}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            <TaskCard
                              task={task}
                              onEdit={() => setEditingTask(task)}
                              onDelete={() => handleDeleteTask(task._id)}
                              getPriorityColor={getPriorityColor}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {getTasksByStatus(column.name).length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <p className="text-sm">No tasks yet</p>
                        <button
                          onClick={() => handleCreateTask(column.name)}
                          className="text-blue-600 hover:text-blue-700 text-sm mt-2"
                        >
                          Add your first task
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

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