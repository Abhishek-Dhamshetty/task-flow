import React from 'react';
import { Calendar, Edit, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, getPriorityColor }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-gray-900 text-sm leading-snug flex-1 mr-2">
          {task.title}
        </h4>
        <div className="flex space-x-1 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit task"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-gray-400 hover:text-red-600 transition-colors"
            title="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 text-xs mb-3 line-clamp-3">
        {task.description}
      </p>
      
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        
        <div className="flex items-center text-xs text-gray-500">
          <Calendar size={12} className="mr-1" />
          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;