const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const router = express.Router();

// GET /api/tasks/project/:projectId - Get all tasks for a project
router.get('/project/:projectId', async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId })
                           .sort({ status: 1, order: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

// POST /api/tasks - Create new task
router.post('/', async (req, res) => {
  try {
    const { title, description, status, projectId, priority } = req.body;
    
    if (!title || !description || !status || !projectId) {
      return res.status(400).json({ 
        message: 'Title, description, status, and projectId are required' 
      });
    }

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Get the next order number for tasks in this status
    const maxOrderTask = await Task.findOne({ 
      projectId, 
      status 
    }).sort({ order: -1 });
    
    const order = maxOrderTask ? maxOrderTask.order + 1 : 0;

    const task = new Task({ 
      title, 
      description, 
      status, 
      projectId, 
      priority: priority || 'medium',
      order 
    });
    
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error: error.message });
  }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status, priority, order } = req.body;
    
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, order },
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error: error.message });
  }
});

// PUT /api/tasks/:id/move - Move task to different status/position
router.put('/:id/move', async (req, res) => {
  try {
    const { newStatus, newOrder } = req.body;
    
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const oldStatus = task.status;
    const oldOrder = task.order;

    // Update task with new status and order
    task.status = newStatus;
    task.order = newOrder;
    await task.save();

    // Reorder other tasks if necessary
    if (oldStatus !== newStatus) {
      // Decrease order of tasks that were after this task in old status
      await Task.updateMany(
        { 
          projectId: task.projectId, 
          status: oldStatus, 
          order: { $gt: oldOrder } 
        },
        { $inc: { order: -1 } }
      );

      // Increase order of tasks that are after new position in new status
      await Task.updateMany(
        { 
          projectId: task.projectId, 
          status: newStatus, 
          order: { $gte: newOrder },
          _id: { $ne: task._id }
        },
        { $inc: { order: 1 } }
      );
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error moving task', error: error.message });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Reorder remaining tasks in the same status
    await Task.updateMany(
      { 
        projectId: task.projectId, 
        status: task.status, 
        order: { $gt: task.order } 
      },
      { $inc: { order: -1 } }
    );
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

module.exports = router;