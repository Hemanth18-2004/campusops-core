# CampusOps 🎓

**CampusOps** is a comprehensive, role-based academic management system designed to streamline educational workflows for administrators, faculty, and students. Built with modern web technologies, it provides a secure, scalable platform for managing courses, assignments, submissions, and AI-powered lesson planning.

---

## 🌟 Features

### 👨‍💼 Admin Dashboard
- **User Management**: Create and manage users with role assignments (Admin, Faculty, Student)
- **Course Management**: Full CRUD operations for courses
- **Subject Management**: Comprehensive subject administration
- **Complete Oversight**: View and monitor all system activities

### 👨‍🏫 Faculty Dashboard
- **Assignment Creation**: Create and manage assignments for subjects
- **Submission Review**: View and grade student submissions with scores and feedback
- **AI Lesson Plans**: Generate, edit, and save AI-powered lesson plans
- **Student Progress Tracking**: Monitor student submissions and performance

### 👨‍🎓 Student Dashboard
- **Assignment Viewing**: Browse available assignments and due dates
- **Assignment Submission**: Submit assignments with text content
- **Grade Tracking**: View submission status, grades, and faculty feedback
- **Course Overview**: Access course materials and subject information

---

## 🏗️ Architecture

CampusOps follows a modern **client-server architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                      │
│          React Components + TypeScript + Tailwind            │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (HTTP/JSON)
┌──────────────────────────┴──────────────────────────────────┐
│                   Backend (Express.js)                       │
│         Controllers → Models → Database (MongoDB)            │
│              Middleware: Auth, RBAC, Logging                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                MongoDB Database (Mongoose ODM)               │
│      Collections: users, courses, subjects, assignments      │
│              submissions, lessonplans                        │
└──────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs hashing
- **AI Integration**: OpenAI-compatible API (LM Studio)
- **Environment**: dotenv

### Frontend
- **Framework**: Next.js 16.x (App Router)
- **UI Library**: React 19.x
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **HTTP Client**: Native Fetch API with custom wrapper
- **State Management**: React Hooks (useState, useEffect)

### Development
- **Version Control**: Git
- **Code Quality**: ESLint
- **Package Manager**: npm

---

## 📁 Project Structure

```
campusops-core/
├── backend/                      # Backend API server
│   ├── src/
│   │   ├── controllers/          # Request handlers (business logic)
│   │   │   ├── adminController.js
│   │   │   ├── assignmentController.js
│   │   │   ├── authController.js
│   │   │   ├── courseController.js
│   │   │   ├── lessonPlanController.js
│   │   │   ├── subjectController.js
│   │   │   ├── submissionController.js
│   │   │   └── userController.js
│   │   ├── models/               # MongoDB schemas (data models)
│   │   │   ├── Assignment.js
│   │   │   ├── Course.js
│   │   │   ├── LessonPlan.js
│   │   │   ├── Subject.js
│   │   │   ├── Submission.js
│   │   │   └── User.js
│   │   ├── routes/               # API endpoint definitions
│   │   │   ├── adminRoutes.js
│   │   │   ├── assignmentRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── courseRoutes.js
│   │   │   ├── healthRoutes.js
│   │   │   ├── lessonPlanRoutes.js
│   │   │   ├── subjectRoutes.js
│   │   │   ├── submissionRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── middleware/           # Authentication & authorization
│   │   │   ├── authMiddleware.js
│   │   │   ├── authorizeMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   └── loggerMiddleware.js
│   │   ├── services/             # External service integrations
│   │   │   └── aiService.js
│   │   ├── utils/                # Helper functions
│   │   │   ├── asyncHandler.js
│   │   │   ├── errorResponse.js
│   │   │   └── validators.js
│   │   ├── config/               # Configuration files
│   │   │   └── db.js
│   │   ├── scripts/              # Utility scripts
│   │   │   └── seedData.js
│   │   ├── app.js                # Express app configuration
│   │   └── server.js             # Server entry point
│   ├── package.json
│   └── .env                      # Environment variables
│
├── frontend/                     # Frontend Next.js application
│   ├── app/                      # Next.js App Router pages
│   │   ├── login/                # Login page
│   │   ├── dashboard/            # Protected dashboard
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── FacultyDashboard.tsx
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── ...
│   │   └── lib/                  # Utility libraries
│   │       └── api.ts            # API client wrapper
│   ├── public/                   # Static assets
│   ├── package.json
│   └── .env.local                # Frontend environment variables
│
├── docs/                         # Documentation files
├── .gitignore                    # Git ignore rules
├── PROJECT_SUMMARY.md            # Detailed project summary
├── SETUP.md                      # Setup and installation guide
├── QUICK_REFERENCE.md            # Technical quick reference
├── TECHNICAL_PRESENTATION_GUIDE.md
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or cloud instance) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/hemanth18-2004/campusops-core.git
cd campusops-core
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGO_URI=mongodb://localhost:27017/campusops
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# LM Studio Configuration (for AI Lesson Plans)
LM_STUDIO_API_URL=http://localhost:1234/v1
LM_STUDIO_API_KEY=lm-studio
LM_STUDIO_MODEL=llama-3.1-8b-instruct
EOF

# Start MongoDB (if using local instance)
# macOS with Homebrew:
brew services start mongodb-community

# Or using Docker:
docker run -d -p 27017:27017 --name campusops-mongo mongo

# Start the backend server
npm start
```

The backend will be running at `http://localhost:5000`

#### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1" > .env.local

# Start the development server
npm run dev
```

The frontend will be running at `http://localhost:3000`

#### 4. Initial Admin Setup

Since the first user needs admin privileges, you'll need to manually update the database:

1. **Register a user** through the UI at `http://localhost:3000/login`
2. **Connect to MongoDB** and update the role:
   ```bash
   # Using MongoDB Shell
   mongosh
   
   use campusops
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```
3. **Login** with your admin account and start managing the system!

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints Overview

#### 🔐 Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token

#### 👨‍💼 Admin (Admin only)
- `GET /admin/users` - Get all users
- `POST /admin/users` - Create a new user with role assignment

#### 📚 Courses (Authenticated)
- `GET /courses` - Get all courses
- `GET /courses/:id` - Get course by ID
- `POST /courses` - Create course *(Admin only)*
- `PUT /courses/:id` - Update course *(Admin only)*
- `DELETE /courses/:id` - Delete course *(Admin only)*

#### 📖 Subjects (Authenticated)
- `GET /subjects` - Get all subjects
- `GET /subjects/:id` - Get subject by ID
- `POST /subjects` - Create subject *(Admin only)*
- `PUT /subjects/:id` - Update subject *(Admin only)*
- `DELETE /subjects/:id` - Delete subject *(Admin only)*

#### 📝 Assignments (Authenticated)
- `GET /assignments` - Get all assignments
- `GET /assignments/:id` - Get assignment by ID
- `POST /assignments` - Create assignment *(Faculty/Admin)*
- `PUT /assignments/:id` - Update assignment *(Faculty/Admin)*
- `DELETE /assignments/:id` - Delete assignment *(Faculty/Admin)*

#### 📤 Submissions (Authenticated)
- `GET /submissions` - Get all submissions
- `GET /submissions/:id` - Get submission by ID
- `POST /submissions` - Create submission *(Student)*
- `POST /submissions/:id/grade` - Grade submission *(Faculty)*

#### 🤖 AI Lesson Plans (Faculty/Admin)
- `POST /lesson-plans/generate` - Generate AI lesson plan
- `GET /lesson-plans` - Get all lesson plans
- `GET /lesson-plans/:id` - Get lesson plan by ID
- `POST /lesson-plans` - Save lesson plan
- `PUT /lesson-plans/:id` - Update lesson plan
- `DELETE /lesson-plans/:id` - Delete lesson plan

#### 👤 User Profile
- `GET /profile` - Get current user profile

For detailed API documentation, refer to [SETUP.md](./SETUP.md#api-endpoints).

---

## 🔒 Security Features

- **JWT Authentication**: Stateless, token-based authentication
- **Password Hashing**: bcryptjs with 10 salt rounds
- **Role-Based Access Control (RBAC)**: Middleware-based authorization
- **Protected Routes**: Both frontend and backend route protection
- **Input Validation**: Mongoose schema validation
- **CORS Configuration**: Controlled cross-origin resource sharing
- **Environment Variables**: Sensitive data stored securely

---

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Role-Based Dashboards**: Customized interfaces for each user role
- **Form Validation**: Client-side validation for better UX
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during async operations
- **Clean Navigation**: Intuitive navbar with user context
- **Modern Aesthetics**: Professional, academic-focused design

---

## 🤖 AI Integration

CampusOps features AI-powered lesson plan generation using **LM Studio** (local AI models):

### Setup LM Studio
1. Download and install [LM Studio](https://lmstudio.ai/)
2. Download a model (recommended: **Llama 3.1 8B Instruct** for M4 Pro with 24GB RAM)
3. Start the local server in LM Studio
4. The AI service will automatically connect to `http://localhost:1234`

### Features
- **Generate lesson plans** from subject, topic, and duration
- **Edit and customize** AI-generated content
- **Save and manage** lesson plans in the database
- **Privacy-focused**: All AI processing happens locally

---

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test  # (Add test scripts in package.json)
```

### Frontend Testing
```bash
cd frontend
npm run lint  # ESLint code quality check
```

---

## 🌱 Future Enhancements

- [ ] File upload support for assignment submissions
- [ ] Email notifications for assignment grading
- [ ] Real-time updates using WebSockets
- [ ] Advanced search and filtering
- [ ] Pagination for large datasets
- [ ] Comprehensive unit and integration tests
- [ ] API documentation with Swagger/OpenAPI
- [ ] Calendar integration for assignment deadlines
- [ ] Analytics dashboard for admins
- [ ] Multi-language support

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `brew services list` (macOS) or `docker ps` (Docker)
- Verify `MONGO_URI` in backend `.env` file

### CORS Errors
- Check that frontend URL matches CORS configuration in `backend/src/app.js`
- Ensure `NEXT_PUBLIC_API_BASE_URL` is set correctly in frontend `.env.local`

### Authentication Errors
- Verify `JWT_SECRET` is set in backend `.env`
- Check token expiration (default: 7 days)
- Clear localStorage and re-login

### Port Already in Use
- Change `PORT` in backend `.env` (default: 5000)
- Or kill the process using the port:
  ```bash
  lsof -ti:5000 | xargs kill
  ```

---

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup and installation instructions
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Complete project overview and features
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Technical Q&A reference guide
- **[TECHNICAL_PRESENTATION_GUIDE.md](./TECHNICAL_PRESENTATION_GUIDE.md)** - Presentation guidance

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Hemanth D C**
- GitHub: [@hemanth18-2004](https://github.com/hemanth18-2004)
- Project: [CampusOps](https://github.com/hemanth18-2004/campusops-core)


---

## 🙏 Acknowledgments

- Built with modern web technologies for educational purposes
- AI integration powered by LM Studio and Llama models
- Inspired by the need for streamlined academic management systems

---


**Made with ❤️ for education**

[⬆ Back to Top](#campusops-)

</div>
