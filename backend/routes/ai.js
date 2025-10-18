const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Task = require('../models/Task');
const Project = require('../models/Project');
const router = express.Router();

// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to get available model - try the most basic one first
const getWorkingModel = async () => {
  const modelNames = [
    'gemini-pro',
    'gemini-1.0-pro',
    'text-bison-001',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
  ];

  for (const modelName of modelNames) {
    try {
      console.log(`🔄 Testing model: ${modelName}`);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        }
      });
      
      // Simple test to verify model works
      const testResult = await model.generateContent("Hello, respond with 'AI is working'");
      await testResult.response.text();
      
      console.log(`✅ Successfully using model: ${modelName}`);
      return model;
    } catch (error) {
      console.log(`❌ Model ${modelName} failed: ${error.message}`);
      continue;
    }
  }
  
  throw new Error('No working Gemini model available. Please check your API key permissions.');
};

// Function to analyze project comprehensively
const analyzeProjectComprehensively = async (project, tasks) => {
  const analysis = {
    project: {
      name: project.name,
      description: project.description,
      createdAt: project.createdAt,
      totalDays: Math.ceil((new Date() - new Date(project.createdAt)) / (1000 * 60 * 60 * 24))
    },
    tasks: {
      total: tasks.length,
      byStatus: {},
      byPriority: {},
      completed: tasks.filter(t => t.status === 'Done').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      pending: tasks.filter(t => t.status === 'To Do').length
    },
    insights: {
      completionRate: 0,
      avgTaskAge: 0,
      priorityDistribution: {},
      bottlenecks: [],
      recommendations: []
    }
  };

  // Calculate task statistics
  tasks.forEach(task => {
    // By status
    if (!analysis.tasks.byStatus[task.status]) {
      analysis.tasks.byStatus[task.status] = [];
    }
    analysis.tasks.byStatus[task.status].push(task);

    // By priority
    if (!analysis.tasks.byPriority[task.priority]) {
      analysis.tasks.byPriority[task.priority] = 0;
    }
    analysis.tasks.byPriority[task.priority]++;
  });

  // Calculate completion rate
  analysis.insights.completionRate = analysis.tasks.total > 0 
    ? Math.round((analysis.tasks.completed / analysis.tasks.total) * 100) 
    : 0;

  // Calculate average task age
  const taskAges = tasks.map(task => 
    Math.ceil((new Date() - new Date(task.createdAt)) / (1000 * 60 * 60 * 24))
  );
  analysis.insights.avgTaskAge = taskAges.length > 0 
    ? Math.round(taskAges.reduce((a, b) => a + b, 0) / taskAges.length) 
    : 0;

  return analysis;
};

// POST /api/ai/summarize - Enhanced comprehensive summary with simpler prompts
router.post('/summarize', async (req, res) => {
  try {
    const { projectId } = req.body;
    
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    console.log(`📊 Generating comprehensive summary for project: ${projectId}`);

    // Get project and tasks
    const [project, tasks] = await Promise.all([
      Project.findById(projectId),
      Task.find({ projectId }).sort({ createdAt: -1 })
    ]);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Perform comprehensive analysis
    const analysis = await analyzeProjectComprehensively(project, tasks);

    if (tasks.length === 0) {
      return res.json({ 
        summary: `🏨 **${project.name} - Project Ready for Development**\n\n✨ **Current Status:** Project initialized and ready for tasks\n\n🎯 **Recommended First Steps:**\n• Create core feature tasks\n• Define project milestones\n• Set up development workflow\n• Begin with high-priority items\n\n💡 **For Hostel Management System:**\n• Student registration module\n• Room allocation system\n• Billing and payments\n• Admin dashboard\n• Security and access control\n\n🚀 **Start by adding your first task to begin development!**` 
      });
    }

    // Simplified prompt for better compatibility
    const simplePrompt = `Analyze this project:

Project: ${analysis.project.name}
Description: ${analysis.project.description}
Total Tasks: ${analysis.tasks.total}
Completed: ${analysis.tasks.completed}
In Progress: ${analysis.tasks.inProgress}
Pending: ${analysis.tasks.pending}
Completion Rate: ${analysis.insights.completionRate}%

Tasks by status:
${Object.entries(analysis.tasks.byStatus).map(([status, statusTasks]) => 
  `${status}: ${statusTasks.length} tasks`
).join('\n')}

Detailed tasks:
${tasks.slice(0, 10).map(task => 
  `- ${task.title} (${task.status}, ${task.priority} priority): ${task.description.substring(0, 100)}`
).join('\n')}

Please provide a comprehensive project analysis with:
1. Executive Summary
2. Progress Analysis  
3. Key Insights
4. Recommendations
5. Next Steps

Format with clear sections and actionable advice.`;

    try {
      const model = await getWorkingModel();
      const result = await model.generateContent(simplePrompt);
      const response = await result.response;
      const summary = response.text();

      console.log('✅ AI comprehensive summary generated successfully');
      res.json({ summary, analysis: analysis.insights });
    } catch (aiError) {
      console.error('❌ AI generation failed:', aiError.message);
      
      // Enhanced intelligent fallback
      const fallbackSummary = `🏨 **${analysis.project.name} - Comprehensive Project Analysis**

🎯 **Executive Summary**
• Project Health: ${analysis.insights.completionRate > 70 ? '🟢 Excellent Progress' : analysis.insights.completionRate > 40 ? '🟡 Good Progress' : '🔴 Needs Attention'}
• Completion Rate: ${analysis.insights.completionRate}% (${analysis.tasks.completed}/${analysis.tasks.total} tasks completed)
• Project Age: ${analysis.project.totalDays} days since creation
• Active Tasks: ${analysis.tasks.inProgress} in development

📈 **Progress Analysis**
• ✅ Completed Tasks: ${analysis.tasks.completed}
• 🔄 In Progress: ${analysis.tasks.inProgress} 
• 📋 Pending: ${analysis.tasks.pending}
• Priority Distribution: High (${analysis.tasks.byPriority.high || 0}) | Medium (${analysis.tasks.byPriority.medium || 0}) | Low (${analysis.tasks.byPriority.low || 0})

🔍 **Key Insights**
${analysis.tasks.inProgress > analysis.tasks.pending ? '• ✅ Good momentum with active development' : '• ⚠️ Consider moving more tasks to active development'}
${analysis.insights.completionRate > 50 ? '• 🚀 Strong progress - over halfway complete' : '• 📈 Early stage - focus on completing current tasks'}
${analysis.tasks.byPriority.high > analysis.tasks.total * 0.4 ? '• ⚠️ High concentration of critical tasks' : '• ✅ Balanced task priorities'}

💡 **Strategic Recommendations**
• **Immediate Focus:** Complete ${analysis.tasks.inProgress} active tasks for quick wins
• **Workflow Optimization:** ${analysis.tasks.pending > 10 ? 'Break down large pending tasks' : 'Maintain current task granularity'}  
• **Priority Management:** ${analysis.tasks.byPriority.high > 0 ? 'Address high-priority items first' : 'Continue with current priority balance'}
• **Velocity:** ${analysis.insights.avgTaskAge > 14 ? 'Review long-running tasks for blockers' : 'Good task completion pace'}

🚀 **Next Steps**
1. Focus on completing in-progress tasks
2. Review and refine pending task descriptions
3. ${analysis.insights.completionRate < 30 ? 'Consider breaking complex tasks into smaller pieces' : 'Maintain current development pace'}
4. Set up weekly progress reviews

📊 **Performance Metrics**
• Tasks per Status: ${Object.entries(analysis.tasks.byStatus).map(([status, tasks]) => `${status} (${tasks.length})`).join(' | ')}
• Recommended Review Frequency: ${analysis.tasks.total > 20 ? 'Weekly' : 'Bi-weekly'}

⚡ **Project-Specific Insights**
${project.name.toLowerCase().includes('hostel') ? 
`🏨 **Hostel Management Focus Areas:**
• Core Features: Student registration, room allocation, billing
• Security: Access control, visitor management  
• Operations: Check-in/out processes, maintenance tracking
• Analytics: Occupancy reports, financial summaries` : 
`📋 **General Project Recommendations:**
• Define clear milestones and deadlines
• Establish regular stakeholder communication
• Implement code review processes
• Set up automated testing where applicable`}

⚠️ **Note:** This analysis is based on comprehensive project data. AI-enhanced insights temporarily unavailable but will be restored soon.`;
      
      res.json({ summary: fallbackSummary, analysis: analysis.insights });
    }
  } catch (error) {
    console.error('❌ Summary route error:', error);
    res.status(500).json({ 
      message: 'Error generating summary', 
      error: error.message 
    });
  }
});

// GET /api/ai/questions/:projectId - Generate intelligent questions
router.get('/questions/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    console.log(`❓ Generating intelligent questions for project: ${projectId}`);

    const [project, tasks] = await Promise.all([
      Project.findById(projectId),
      Task.find({ projectId }).sort({ createdAt: -1 })
    ]);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const analysis = await analyzeProjectComprehensively(project, tasks);

    // Generate context-aware questions based on project analysis
    let intelligentQuestions = [];

    // Base questions
    intelligentQuestions.push(
      `What are the key milestones for ${project.name}?`,
      `How can I optimize the workflow for this project?`,
      `What are the critical success factors?`
    );

    // Conditional questions based on project state
    if (analysis.tasks.total === 0) {
      intelligentQuestions.push(
        `What should be the first tasks for ${project.name}?`,
        `How should I structure the initial development phases?`,
        `What are the essential features to build first?`
      );
    } else {
      // Progress-based questions
      if (analysis.insights.completionRate < 30) {
        intelligentQuestions.push(
          `Why is the completion rate low and how can I improve it?`,
          `Should I break down tasks into smaller pieces?`,
          `What might be blocking task completion?`
        );
      }

      if (analysis.tasks.inProgress > 5) {
        intelligentQuestions.push(
          `Are there too many tasks in progress simultaneously?`,
          `How can I focus efforts for better completion rates?`,
          `Which active tasks should be prioritized?`
        );
      }

      // Project-specific questions
      if (project.name.toLowerCase().includes('hostel')) {
        intelligentQuestions.push(
          `What are the core features for hostel management?`,
          `How should I handle student registration and room allocation?`,
          `What security features are essential for hostel operations?`,
          `How can I implement efficient billing and payment systems?`,
          `What reporting features do hostel administrators need?`,
          `How should I design the check-in/check-out workflow?`
        );
      }
    }

    // Add performance and strategy questions
    intelligentQuestions.push(
      `What metrics should I track for project success?`,
      `How can I improve development productivity?`,
      `What are potential risks and mitigation strategies?`,
      `When should this project realistically be completed?`
    );

    // Remove duplicates and limit
    const uniqueQuestions = [...new Set(intelligentQuestions)].slice(0, 12);

    res.json({ 
      questions: uniqueQuestions,
      projectContext: {
        name: project.name,
        tasksCount: analysis.tasks.total,
        completionRate: analysis.insights.completionRate,
        projectAge: analysis.project.totalDays
      }
    });
  } catch (error) {
    console.error('❌ Question generation error:', error);
    res.status(500).json({ 
      message: 'Error generating questions', 
      error: error.message 
    });
  }
});

// POST /api/ai/question - Enhanced question answering
router.post('/question', async (req, res) => {
  try {
    const { projectId, taskId, question } = req.body;
    
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    console.log(`❓ Processing AI question: "${question}"`);

    let context = '';
    let fullAnalysis = null;
    
    if (taskId) {
      // Question about specific task
      const task = await Task.findById(taskId).populate('projectId');
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const allProjectTasks = await Task.find({ projectId: task.projectId._id });
      fullAnalysis = await analyzeProjectComprehensively(task.projectId, allProjectTasks);
      
      context = `Task: ${task.title}
Description: ${task.description}
Status: ${task.status}
Priority: ${task.priority}
Project: ${task.projectId.name}
Project completion: ${fullAnalysis.insights.completionRate}%`;

    } else if (projectId) {
      // Question about project
      const [project, tasks] = await Promise.all([
        Project.findById(projectId),
        Task.find({ projectId })
      ]);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      fullAnalysis = await analyzeProjectComprehensively(project, tasks);
      
      context = `Project: ${project.name}
Description: ${project.description}
Total Tasks: ${fullAnalysis.tasks.total}
Completion Rate: ${fullAnalysis.insights.completionRate}%
Active Tasks: ${fullAnalysis.tasks.inProgress}
Pending Tasks: ${fullAnalysis.tasks.pending}

Recent tasks:
${tasks.slice(0, 8).map(task => `- ${task.title} (${task.status}): ${task.description.substring(0, 100)}`).join('\n')}`;
    } else {
      return res.status(400).json({ 
        message: 'Either projectId or taskId is required' 
      });
    }

    // Simplified prompt for better model compatibility
    const simplePrompt = `Based on this project information:

${context}

Question: ${question}

Please provide a helpful response with:
1. Direct answer to the question
2. Relevant insights based on the project data
3. Actionable recommendations
4. Best practices if applicable

Keep response clear and practical.`;

    try {
      const model = await getWorkingModel();
      const result = await model.generateContent(simplePrompt);
      const response = await result.response;
      const answer = response.text();

      console.log('✅ AI question answered successfully');
      res.json({ 
        answer, 
        question,
        context: fullAnalysis ? {
          completionRate: fullAnalysis.insights.completionRate,
          totalTasks: fullAnalysis.tasks.total,
          projectAge: fullAnalysis.project.totalDays
        } : null
      });
    } catch (aiError) {
      console.error('❌ AI question failed:', aiError.message);
      
      // Intelligent fallback response
      const fallbackAnswer = `🤖 **Project Management Assistant Response**

📝 **Your Question:** "${question}"

Based on your project data:

${context}

💡 **Intelligent Analysis:**

${fullAnalysis ? `
📊 **Project Health:** ${fullAnalysis.insights.completionRate > 70 ? '🟢 Excellent' : fullAnalysis.insights.completionRate > 40 ? '🟡 Good' : '🔴 Needs Attention'}

🎯 **Key Recommendations:**
• Focus on completing ${fullAnalysis.tasks.inProgress} active tasks
• Review ${fullAnalysis.tasks.pending} pending tasks for priorities
• Current completion velocity: ${fullAnalysis.insights.completionRate}%

⚠️ **Project Insights:**
${fullAnalysis.tasks.inProgress > fullAnalysis.tasks.pending ? '• Good momentum with more active than pending tasks' : '• Consider activating more pending tasks'}
${fullAnalysis.insights.completionRate > 50 ? '• Strong progress trajectory' : '• Early development phase - building momentum'}
` : ''}

🔧 **General Guidance for Your Question:**
${question.toLowerCase().includes('milestone') ? '• Break project into 2-3 week sprints\n• Define clear deliverables for each phase\n• Set measurable completion criteria' : ''}
${question.toLowerCase().includes('optimize') || question.toLowerCase().includes('workflow') ? '• Focus on completing tasks before starting new ones\n• Use daily standup meetings for coordination\n• Implement code review processes' : ''}
${question.toLowerCase().includes('priority') || question.toLowerCase().includes('feature') ? '• Prioritize features that deliver core value first\n• Consider user impact and technical complexity\n• Validate assumptions with stakeholders' : ''}
${question.toLowerCase().includes('risk') ? '• Document dependencies between tasks\n• Identify critical path items\n• Plan contingencies for high-risk features' : ''}

💼 **Best Practices:**
• Regular progress reviews (weekly recommended)
• Clear task definitions and acceptance criteria  
• Stakeholder communication and feedback loops
• Technical debt management alongside feature development

⚠️ **Note:** Full AI analysis temporarily unavailable. This response uses intelligent project data analysis to provide relevant guidance.`;
      
      res.json({ 
        answer: fallbackAnswer, 
        question,
        context: fullAnalysis ? {
          completionRate: fullAnalysis.insights.completionRate,
          totalTasks: fullAnalysis.tasks.total,
          projectAge: fullAnalysis.project.totalDays
        } : null
      });
    }
  } catch (error) {
    console.error('❌ Question route error:', error);
    res.status(500).json({ 
      message: 'Error processing question', 
      error: error.message 
    });
  }
});

// GET /api/ai/test - Test AI connectivity with simpler prompt
router.get('/test', async (req, res) => {
  try {
    const model = await getWorkingModel();
    const result = await model.generateContent('Say: AI is working for project management!');
    const response = await result.response;
    const text = response.text();
    
    res.json({ 
      status: 'success', 
      message: 'AI is working correctly!',
      response: text,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'AI test failed', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;