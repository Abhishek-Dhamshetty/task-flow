# 🏨 TaskFlow AI - Intelligent Project Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-%5E19.1.1-blue)](https://reactjs.org/)

> **DevVoid SWE Assignment** - A modern, AI-powered project management application with intelligent insights and hostel management capabilities.

## ✨ Features

### 🎯 **Core Functionality**
- **Kanban Board Management** - Drag & drop task organization
- **Project Creation & Management** - Multi-project workspace
- **Task Lifecycle Management** - Create, edit, move, and delete tasks
- **Priority System** - High, Medium, Low priority classification
- **Real-time Updates** - Instant task status synchronization

### 🤖 **AI-Powered Insights**
- **Intelligent Project Analysis** - Comprehensive progress summaries
- **Smart Question Generation** - Context-aware AI suggestions
- **Project Health Assessment** - Automated bottleneck detection
- **Strategic Recommendations** - AI-driven improvement suggestions
- **Hostel Management Expertise** - Specialized insights for hostel projects

### 💻 **Technical Excellence**
- **Responsive Design** - Works seamlessly on all devices
- **Modern Tech Stack** - React 19, Node.js, MongoDB, Tailwind CSS
- **Google Gemini AI Integration** - Advanced natural language processing
- **Robust Error Handling** - Graceful fallbacks and user feedback
- **RESTful API Design** - Clean, scalable backend architecture

## 🎬 Demo

### Live Application
🔗 **Frontend**: [https://taskflow-ai.vercel.app](https://your-frontend-url.vercel.app)  
🔗 **Backend API**: [https://taskflow-api.render.com](https://your-backend-url.render.com)

### Video Demonstration
🎥 **Full Feature Demo**: [Watch on YouTube](https://your-demo-video-link)

### Screenshots

<div align="center">

#### Project Dashboard
![Project Dashboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Project+Dashboard)

#### Kanban Board
![Kanban Board](https://via.placeholder.com/800x400/10B981/FFFFFF?text=Kanban+Board)

#### AI Analysis
![AI Analysis](https://via.placeholder.com/800x400/F59E0B/FFFFFF?text=AI+Analysis)

</div>

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with Concurrent Features
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Beautiful DnD** - Drag and drop functionality
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Google Gemini AI** - Advanced AI integration
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **MongoDB** (Atlas recommended)
- **Google AI Studio API Key**

### 1. Clone Repository
```bash
git clone https://github.com/your-username/taskflow-ai.git
cd taskflow-ai
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
nano .env
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

# Create .env.local file
echo "VITE_API_URL=http://localhost:5001/api" > .env.local
```

**Start Frontend Application:**
```bash
npm run dev
# Application runs on http://localhost:5173
```

### 4. Open Application
Visit [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
taskflow-ai/
├── backend/                 # Node.js Express API
│   ├── models/             # MongoDB schemas
│   │   ├── Project.js      # Project model
│   │   └── Task.js         # Task model
│   ├── routes/             # API endpoints
│   │   ├── projects.js     # Project CRUD operations
│   │   ├── tasks.js        # Task management
│   │   └── ai.js           # AI integration
│   ├── .env                # Environment variables
│   ├── server.js           # Express server setup
│   └── package.json        # Dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── AISummaryModal.jsx
│   │   │   ├── AIQuestionModal.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── ...
│   │   ├── pages/          # Main page components
│   │   │   ├── ProjectList.jsx
│   │   │   └── KanbanBoard.jsx
│   │   ├── context/        # React Context
│   │   ├── services/       # API calls
│   │   └── App.jsx         # Main app component
│   ├── .env.local          # Environment variables
│   └── package.json        # Dependencies
└── README.md               # Project documentation
```

## 🔑 API Documentation

### Projects API
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks API
- `GET /api/tasks/project/:projectId` - Get project tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `PUT /api/tasks/:id/move` - Move task between columns
- `DELETE /api/tasks/:id` - Delete task

### AI API
- `POST /api/ai/summarize` - Generate project summary
- `POST /api/ai/question` - Ask AI about project
- `GET /api/ai/questions/:projectId` - Get suggested questions
- `GET /api/ai/test` - Test AI connectivity

## 🎯 Usage Guide

### Creating Your First Project
1. **Click "New Project"** on the dashboard
2. **Fill in project details** (name and description)
3. **Click "Create Project"** to initialize

### Managing Tasks
1. **Add tasks** using the "+" button in any column
2. **Drag and drop** tasks between columns (To Do → In Progress → Done)
3. **Edit tasks** by clicking the edit icon
4. **Set priorities** (High, Medium, Low) for better organization

### AI Features
1. **AI Summary**: Click "AI Summary" for comprehensive project analysis
2. **Ask AI**: Click "Ask AI" to get intelligent suggestions and answers
3. **Smart Questions**: Use AI-generated questions based on your project state

### Hostel Management Example
Perfect for managing hostel operations with features like:
- Student registration workflows
- Room allocation tracking
- Billing system development
- Visitor management processes

## 🔧 Configuration

### MongoDB Setup
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create new cluster
3. Get connection string
4. Add to `MONGODB_URI` in `.env`

### Google AI API Setup
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Add to `GEMINI_API_KEY` in `.env`

### Environment Variables

**Backend (.env)**:
```env
NODE_ENV=production|development
PORT=5001
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=AIzaSy...
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend (.env.local)**:
```env
VITE_API_URL=https://your-backend-domain.com/api
```

## 🚀 Deployment

### Option 1: Vercel + Render (Recommended)

**Frontend (Vercel):**
```bash
npm i -g vercel
cd frontend
vercel --prod
```

**Backend (Render):**
1. Push code to GitHub
2. Connect repository to [Render](https://render.com)
3. Set environment variables
4. Deploy

### Option 2: Netlify + Railway

**Frontend (Netlify):**
```bash
npm run build
# Upload dist/ folder to Netlify
```

**Backend (Railway):**
```bash
npm i -g @railway/cli
railway login
railway deploy
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
# Test AI connectivity
curl http://localhost:5001/api/ai/test

# Test health endpoint
curl http://localhost:5001/api/health
```

### Frontend Testing
```bash
cd frontend
npm run build  # Test production build
npm run preview  # Preview production build
```

## 🐛 Troubleshooting

### Common Issues

**AI Not Working:**
- Check `GEMINI_API_KEY` is valid
- Verify API key has proper permissions
- Test with `/api/ai/test` endpoint

**Database Connection:**
- Verify `MONGODB_URI` format
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

**CORS Errors:**
- Update `FRONTEND_URL` in backend `.env`
- Check Vercel/Netlify domain matches

**Build Failures:**
- Clear `node_modules` and reinstall
- Check Node.js version compatibility
- Verify all environment variables

### Performance Optimization
- Enable MongoDB indexes for large datasets
- Implement caching for AI responses
- Use CDN for static assets
- Optimize images and bundle size

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### Development Guidelines
- Follow ESLint configuration
- Write meaningful commit messages
- Test thoroughly before submitting
- Update documentation for new features

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **DevVoid** - For the challenging and engaging assignment
- **Google Gemini AI** - For powerful AI capabilities
- **MongoDB Atlas** - For reliable database hosting
- **Vercel & Render** - For seamless deployment platforms
- **React & Node.js Communities** - For excellent documentation and support

## 📧 Contact

**Developer**: [Your Name]  
**Email**: your.email@example.com  
**LinkedIn**: [your-linkedin-profile]  
**Portfolio**: [your-portfolio-website]

---

<div align="center">

**Built with ❤️ for DevVoid SWE Assignment**

[⭐ Star this repo](https://github.com/your-username/taskflow-ai) | [🐛 Report Bug](https://github.com/your-username/taskflow-ai/issues) | [✨ Request Feature](https://github.com/your-username/taskflow-ai/issues)

</div>