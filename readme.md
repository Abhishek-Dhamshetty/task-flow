# 🏨 TaskFlow AI - Intelligent Project Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-%5E19.1.1-blue)](https://reactjs.org/)

> **DevVoid SWE Assignment** - A modern, AI-powered project management application with intelligent insights and comprehensive task management capabilities.

## 🎬 Live Demo

### 🔗 **Live Application**: [TaskFlow AI](https://task-flow-gamma-ten.vercel.app)
### 🔗 **Backend API**: [TaskFlow API](https://task-flow-v5ts.onrender.com)

## ✨ Features

### 🎯 **Core Functionality**
- **Kanban Board Management** - Drag & drop task organization with smooth animations
- **Project Creation & Management** - Multi-project workspace with comprehensive tracking
- **Task Lifecycle Management** - Create, edit, move, and delete tasks seamlessly
- **Priority System** - High, Medium, Low priority classification with visual indicators
- **Real-time Updates** - Instant task status synchronization across columns

### 🤖 **AI-Powered Insights**
- **Intelligent Project Analysis** - Comprehensive progress summaries with completion metrics
- **Smart Question Generation** - Context-aware AI suggestions based on project state
- **Project Health Assessment** - Automated bottleneck detection and risk analysis
- **Strategic Recommendations** - AI-driven improvement suggestions for workflow optimization
- **Specialized Domain Knowledge** - Enhanced insights for specific project types (e.g., hostel management)

### 💻 **Technical Excellence**
- **Responsive Design** - Works flawlessly on desktop, tablet, and mobile devices
- **Modern Tech Stack** - React 19, Node.js, MongoDB, Tailwind CSS
- **Google Gemini AI Integration** - Advanced natural language processing capabilities
- **Robust Error Handling** - Graceful fallbacks with comprehensive user feedback
- **RESTful API Design** - Clean, scalable backend architecture with proper validation

## 🛠️ Tech Stack

### Frontend Architecture
- **React 19** - Latest React with Concurrent Features and improved performance
- **Vite** - Lightning-fast build tool with hot module replacement
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **@dnd-kit** - Modern drag and drop functionality (React 19 compatible)
- **Axios** - Promise-based HTTP client with interceptors
- **React Router** - Declarative client-side routing
- **Lucide React** - Beautiful, customizable icon library

### Backend Infrastructure
- **Node.js** - JavaScript runtime for scalable server applications
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - Document-based NoSQL database with flexible schema
- **Mongoose** - Elegant MongoDB object modeling
- **Google Gemini AI** - Advanced AI integration for intelligent features
- **CORS** - Cross-origin resource sharing configuration
- **Helmet** - Security middleware for Express applications
- **Rate Limiting** - API protection against abuse

## 🚀 Quick Start

### Prerequisites
```bash
# Required software
Node.js >= 18.0.0
npm or yarn
MongoDB Atlas account
Google AI Studio API Key
```

### 1. Clone Repository
```bash
git clone https://github.com/Abhishek-Dhamshetty/task-flow.git
cd task-flow
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your credentials
```

**Backend Environment Variables** (`.env`):
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement
GEMINI_API_KEY=your_google_ai_api_key
FRONTEND_URL=http://localhost:5173
```

**Start Backend Server:**
```bash
npm run dev
# Server runs on http://localhost:5001
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:5001/api" > .env.local
```

**Start Frontend Application:**
```bash
npm run dev
# Application runs on http://localhost:5173
```

### 4. Open Application
Visit [http://localhost:5173](http://localhost:5173) to access TaskFlow AI locally, or visit the live demo at [https://task-flow-gamma-ten.vercel.app](https://task-flow-gamma-ten.vercel.app).

## 📁 Project Structure

```
task-flow/
├── backend/                 # Node.js Express API
│   ├── models/             # MongoDB schemas
│   │   ├── Project.js      # Project data model
│   │   └── Task.js         # Task data model
│   ├── routes/             # API endpoints
│   │   ├── projects.js     # Project CRUD operations
│   │   ├── tasks.js        # Task management endpoints
│   │   └── ai.js           # AI integration endpoints
│   ├── .env                # Environment variables
│   ├── server.js           # Express server configuration
│   └── package.json        # Backend dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── AISummaryModal.jsx     # AI project analysis
│   │   │   ├── AIQuestionModal.jsx    # AI Q&A interface
│   │   │   ├── TaskCard.jsx           # Individual task display
│   │   │   ├── CreateTaskModal.jsx    # Task creation form
│   │   │   ├── EditTaskModal.jsx      # Task editing interface
│   │   │   └── Navbar.jsx             # Navigation component
│   │   ├── pages/          # Main application pages
│   │   │   ├── ProjectList.jsx        # Project dashboard
│   │   │   └── KanbanBoard.jsx        # Task management board
│   │   ├── context/        # React Context for state
│   │   ├── services/       # API communication layer
│   │   └── App.jsx         # Main application component
│   ├── .env.local          # Frontend environment variables
│   └── package.json        # Frontend dependencies
└── README.md               # Project documentation
```

## 🔑 API Documentation

### Projects API
```bash
GET    /api/projects          # Get all projects
POST   /api/projects          # Create new project
GET    /api/projects/:id      # Get project by ID
PUT    /api/projects/:id      # Update project
DELETE /api/projects/:id      # Delete project
```

### Tasks API
```bash
GET    /api/tasks/project/:projectId  # Get project tasks
POST   /api/tasks                     # Create new task
PUT    /api/tasks/:id                 # Update task
PUT    /api/tasks/:id/move            # Move task between columns
DELETE /api/tasks/:id                 # Delete task
```

### AI API
```bash
POST   /api/ai/summarize              # Generate project summary
POST   /api/ai/question               # Ask AI about project
GET    /api/ai/questions/:projectId   # Get suggested questions
GET    /api/ai/test                   # Test AI connectivity
```

## 🎯 Usage Guide

### Creating Your First Project
1. **Click "New Project"** on the main dashboard
2. **Fill in project details** including name and description
3. **Click "Create Project"** to initialize your workspace

### Managing Tasks Efficiently
1. **Add tasks** using the "+" button in any column (To Do, In Progress, Done)
2. **Drag and drop** tasks between columns to update their status
3. **Edit tasks** by clicking the edit icon for detailed modifications
4. **Set priorities** (High, Medium, Low) for better task organization
5. **Delete tasks** when they're no longer needed

### Leveraging AI Features
1. **AI Summary**: Click "AI Summary" for comprehensive project analysis including:
   - Completion rate and project health metrics
   - Task distribution insights and bottleneck identification
   - Strategic recommendations for improvement
   
2. **Ask AI**: Click "Ask AI" to:
   - Get intelligent suggestions based on project context
   - Ask specific questions about task priorities or workflow
   - Receive expert advice on project management best practices

3. **Smart Questions**: Use AI-generated questions that adapt to your project state

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
npm install -g vercel
cd frontend
vercel --prod
```

### Backend Deployment (Render)
1. Push code to GitHub
2. Connect repository to [Render](https://render.com)
3. Configure environment variables
4. Deploy with build command: `npm install`
5. Start command: `npm start`

### Environment Variables for Production

**Render (Backend)**:
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://abhishekdhamshetty:Abhi2005@devvoid.wujikgu.mongodb.net/taskmanagement
GEMINI_API_KEY=AIzaSyBztC4xh2tuFYWJUms7mVbahw07Wn5zwYE
FRONTEND_URL=https://task-flow-gamma-ten.vercel.app
```

**Vercel (Frontend)**:
```env
VITE_API_URL=https://task-flow-v5ts.onrender.com/api
```

## 🧪 Testing

### Backend API Testing
```bash
# Test AI connectivity
curl https://task-flow-v5ts.onrender.com/api/ai/test

# Test health endpoint
curl https://task-flow-v5ts.onrender.com/api/health

# Test projects endpoint
curl https://task-flow-v5ts.onrender.com/api/projects
```

### Frontend Testing
```bash
cd frontend
npm run build    # Test production build
npm run preview  # Preview production build locally
```

## 📊 Key Metrics & Analytics

- **Project Completion Tracking** - Visual progress indicators
- **Task Age Analysis** - Identify long-running tasks
- **Priority Distribution** - Balance high/medium/low priority work
- **Workflow Bottlenecks** - AI-powered issue detection
- **Performance Insights** - Completion velocity tracking

## 🔧 Configuration

### MongoDB Setup
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create new cluster (free tier available)
3. Get connection string from cluster dashboard
4. Add connection string to `MONGODB_URI` environment variable

### Google AI API Setup
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key for Gemini access
3. Add API key to `GEMINI_API_KEY` environment variable

## 🐛 Troubleshooting

### Common Issues & Solutions

**AI Features Not Working:**
- Verify `GEMINI_API_KEY` is correctly set
- Check API key permissions in Google AI Studio
- Test connectivity with `/api/ai/test` endpoint

**Database Connection Issues:**
- Confirm `MONGODB_URI` format is correct
- Check IP whitelist settings in MongoDB Atlas
- Verify network connectivity to MongoDB servers

**CORS Errors:**
- Ensure `FRONTEND_URL` matches your deployment domain
- Check CORS configuration in backend server
- Verify environment variables are properly set

**Build/Deployment Failures:**
- Clear `node_modules` and reinstall dependencies
- Check Node.js version compatibility (>=18.0.0)
- Verify all environment variables are configured

## 🎯 DevVoid Assignment Compliance

This project demonstrates:

✅ **Complete CRUD Operations** - Full project and task management  
✅ **Modern Frontend Architecture** - React 19 with responsive design  
✅ **Robust Backend API** - Express.js with comprehensive endpoints  
✅ **Database Integration** - MongoDB with optimized schemas  
✅ **AI Integration** - Google Gemini for intelligent insights  
✅ **Production Deployment** - Live application with proper hosting  
✅ **Code Quality** - Clean architecture with error handling  
✅ **Documentation** - Comprehensive setup and usage instructions  

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **DevVoid** - For providing this engaging software engineering challenge
- **Google Gemini AI** - For advanced AI capabilities that power intelligent insights
- **MongoDB Atlas** - For reliable cloud database hosting
- **Vercel & Render** - For seamless deployment platforms
- **React Community** - For excellent documentation and ecosystem support

## 📧 Contact & Support

**Developer**: Abhishek Dhamshetty  
**Email**: abhishekdhamshetty@gmail.com  
**GitHub**: [@Abhishek-Dhamshetty](https://github.com/Abhishek-Dhamshetty)  
**LinkedIn**: [Connect with me](https://linkedin.com/in/abhishek-dhamshetty)

---

<div align="center">

**🎯 Built for DevVoid SWE Assignment with ❤️**

[⭐ Star this repo](https://github.com/Abhishek-Dhamshetty/task-flow) | [🐛 Report Issues](https://github.com/Abhishek-Dhamshetty/task-flow/issues) | [✨ Request Features](https://github.com/Abhishek-Dhamshetty/task-flow/issues)

</div>