import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTask } from '../context/TaskContext';
import { projectAPI } from '../services/api';
import { Plus, Calendar, Trash2, Edit, Folder } from 'lucide-react';
import CreateProjectModal from '../components/CreateProjectModal';
import EditProjectModal from '../components/EditProjectModal';

const ProjectList = () => {
  const { state, dispatch } = useTask();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await projectAPI.getAll();
      dispatch({ type: 'SET_PROJECTS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
      try {
        await projectAPI.delete(projectId);
        dispatch({ type: 'DELETE_PROJECT', payload: projectId });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    }
  };

  if (state.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">Manage your projects and track progress</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors shadow-md"
        >
          <Plus size={20} />
          <span>New Project</span>
        </button>
      </div>

      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center">
            <span className="font-medium">Error:</span>
            <span className="ml-2">{state.error}</span>
          </div>
        </div>
      )}

      {state.projects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="text-gray-400 mb-4">
            <Folder size={64} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get started by creating your first project. Organize your tasks and boost productivity with AI-powered insights.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {state.projects.map((project) => (
            <div key={project._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 truncate flex-1 mr-3">
                    {project.name}
                  </h3>
                  <div className="flex space-x-2 flex-shrink-0">
                    <button
                      onClick={() => setEditingProject(project)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit project"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <Calendar size={16} className="mr-2" />
                  <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                
                <Link
                  to={`/project/${project._id}`}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg transition-colors font-medium"
                >
                  Open Board
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onProjectCreated={(project) => {
            dispatch({ type: 'ADD_PROJECT', payload: project });
            setShowCreateModal(false);
          }}
        />
      )}

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onProjectUpdated={(project) => {
            dispatch({ type: 'UPDATE_PROJECT', payload: project });
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
};

export default ProjectList;