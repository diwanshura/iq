# IQ Test Application

A comprehensive full-stack IQ testing application built with Next.js, Express, MongoDB, and TypeScript. This application provides adaptive intelligence quotient tests with real-time analysis, performance tracking, and detailed cognitive assessment reports.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Adaptive Testing Algorithm](#adaptive-testing-algorithm)
- [Analytics & IQ Estimation](#analytics--iq-estimation)
- [Deployment](#deployment)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Functionality
- **Adaptive Testing**: Dynamic difficulty adjustment based on real-time performance
- **Multiple IQ Ranges**: Tests for three IQ categories (50-100, 100-150, 150+)
- **Cognitive Categories**: Assessment across six cognitive domains:
  - Pattern Recognition
  - Logical Reasoning
  - Spatial Reasoning
  - Numerical Ability
  - Memory
  - Abstract Reasoning

### User Experience
- **User Authentication**: Secure signup/login with session management
- **Test Customization**: Choose test difficulty level based on age range
- **Real-time Performance Tracking**: Live accuracy and time monitoring
- **Detailed Results Dashboard**: Comprehensive analytics and insights
- **Performance History**: View all past test results and progress

### Analytics & Reporting
- **IQ Score Estimation**: AI-powered IQ calculation based on accuracy and speed
- **Category Breakdown**: Performance analysis by cognitive category
- **Speed vs Accuracy Analysis**: Identify strengths and weaknesses
- **Personalized Recommendations**: AI-generated improvement suggestions
- **Cognitive Strengths & Weaknesses**: Detailed cognitive profile

### Question Bank
- **150+ Pre-loaded Questions**: Dataset of verified questions across difficulty levels
- **AI Question Generation**: Dynamic question generation for variety
- **Question Tagging**: Categorized by type and difficulty
- **Timed Questions**: Each question has configurable time limits (40 seconds default)

## 🛠 Tech Stack

### Frontend
- **Next.js 16.2.4** - React framework with SSR/SSG support
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - React charting library
- **Axios** - HTTP client

### Backend
- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Passport.js** - Authentication middleware
- **express-session** - Session management
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### DevTools
- **TypeScript** - Type safety across entire stack
- **Nodemon** - Development auto-reload
- **ts-node** - TypeScript execution for Node.js
- **ESLint** - Code linting (configured)

## 📁 Project Structure

```
iq/
├── server/                          # Backend Express server
│   ├── src/
│   │   ├── app.ts                  # Express app configuration
│   │   ├── server.ts               # Server entry point
│   │   ├── config/
│   │   │   ├── database.ts         # MongoDB connection
│   │   │   ├── passport.ts         # Passport authentication setup
│   │   │   ├── constants.ts        # Application constants
│   │   │   └── environment.ts      # Environment variables
│   │   ├── models/
│   │   │   ├── User.ts             # User schema & methods
│   │   │   ├── Question.ts         # Question schema
│   │   │   ├── Test.ts             # Test session schema
│   │   │   └── TestResult.ts       # Test results schema
│   │   ├── controllers/
│   │   │   ├── authController.ts   # Authentication endpoints
│   │   │   ├── testController.ts   # Test management endpoints
│   │   │   └── resultsController.ts # Results retrieval endpoints
│   │   ├── routes/
│   │   │   ├── auth.routes.ts      # Authentication routes
│   │   │   ├── tests.routes.ts     # Test routes
│   │   │   └── results.routes.ts   # Results routes
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts  # Authentication middleware
│   │   │   └── errorHandler.ts     # Error handling middleware
│   │   ├── services/
│   │   │   ├── questionService.ts  # Question selection logic
│   │   │   ├── adaptiveEngine.ts   # Adaptive algorithm
│   │   │   ├── analyticsService.ts # Result analytics
│   │   │   ├── questionGenerator.ts # AI question generation
│   │   │   └── datasetLoader.ts    # Dataset initialization
│   │   └── seeds/
│   │       └── seedQuestions.ts    # Question seeding script
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                         # Backend environment variables
│
├── src/                             # Frontend Next.js application
│   ├── app/
│   │   ├── (app)/                  # Authenticated routes
│   │   │   ├── test/[section]/page.tsx      # Test taking page
│   │   │   └── results/[resultId]/page.tsx  # Results page
│   │   ├── (auth)/                 # Auth routes
│   │   │   ├── login/page.tsx      # Login page
│   │   │   └── signup/page.tsx     # Sign up page
│   │   ├── page.tsx                # Home/Dashboard page
│   │   ├── layout.tsx              # Root layout
│   │   └── globals.css             # Global styles
│   ├── components/                 # Reusable components
│   ├── contexts/
│   │   └── AuthContext.tsx         # Authentication context
│   ├── lib/
│   │   └── api.ts                  # API client setup
│   ├── types/
│   │   └── index.ts                # TypeScript type definitions
│   └── styles/                     # Component styles
│
├── public/                          # Static assets
├── package.json                     # Frontend dependencies
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── next.config.ts                   # Next.js configuration
├── .env.local                       # Environment variables (dev)
└── README.md                        # This file
```

## 📋 Prerequisites

Before running this application, ensure you have installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (v5.0 or higher) - local or cloud (MongoDB Atlas)
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd iq
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Setup

Create `.env.local` file in the project root:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/iq-test
# OR for MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/iq-test

# Server
PORT=5000
NODE_ENV=development

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Session
SESSION_SECRET=your-secret-key-change-this-in-production
```

Create `server/.env` file:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/iq-test

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your-secret-key-change-this-in-production
```

## ⚙️ Configuration

### Database Configuration

MongoDB connection happens automatically in `server/src/config/database.ts`:

```typescript
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
};
```

### Application Constants

Modify `server/src/config/constants.ts` to customize:

- Question difficulty ranges
- Adaptive algorithm thresholds
- Cognitive categories
- Timing rules per IQ section
- Question per test count

### Authentication

Passport.js is configured for local strategy (email/password) in `server/src/config/passport.ts`. Extend with additional strategies as needed (OAuth, JWT, etc.).

## ▶️ Running the Application

### Development Mode

```bash
# Run everything with one command (frontend + backend)
npm run dev

# Or run separately in different terminals:
# Terminal 1 - Frontend (Next.js on port 3000)
npm run dev

# Terminal 2 - Backend (Express on port 5000)
cd server
npm run dev
```

### Production Build

```bash
# Build frontend
npm run build

# Start production server
npm start
```

### Backend Only

```bash
cd server
npm run dev          # Development with nodemon
npm run build        # Build to dist/
npm run start        # Run compiled version
```

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "ageRange": "19-45"
}
```

**Response:** `201 Created`
```json
{
  "message": "User created successfully",
  "user": {
    "id": "userId",
    "username": "john_doe",
    "email": "john@example.com",
    "ageRange": "19-45"
  }
}
```

#### POST `/api/auth/login`
Authenticate user

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Logged in successfully",
  "user": { /* user object */ }
}
```

#### POST `/api/auth/logout`
Logout current user

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

#### GET `/api/auth/current-user`
Get current authenticated user

**Response:** `200 OK`
```json
{
  "user": { /* user object */ }
}
```

### Test Endpoints

#### POST `/api/tests/create`
Create a new test session

**Request Body:**
```json
{
  "iq_section": "100-150"
}
```

**Response:** `201 Created`
```json
{
  "testId": "test_id",
  "questions": [{ /* question objects */ }]
}
```

#### GET `/api/tests/:testId`
Get test details and questions

**Response:** `200 OK`
```json
{
  "_id": "test_id",
  "userId": "user_id",
  "iq_section": "100-150",
  "questions": [{ /* questions */ }],
  "startedAt": "2026-04-30T10:00:00Z"
}
```

#### POST `/api/tests/submit-answer`
Submit answer for a question

**Request Body:**
```json
{
  "testId": "test_id",
  "questionId": "question_id",
  "selectedAnswer": "answer_text",
  "timeSpent": 25
}
```

**Response:** `200 OK`
```json
{
  "isCorrect": true,
  "correctAnswer": "answer_text"
}
```

#### POST `/api/tests/submit-test`
Submit completed test

**Request Body:**
```json
{
  "testId": "test_id",
  "totalTime": 480
}
```

**Response:** `200 OK`
```json
{
  "resultId": "result_id",
  "accuracy": 75.5,
  "estimatedIQ": 125
}
```

### Results Endpoints

#### GET `/api/results/:resultId`
Get test results

**Response:** `200 OK`
```json
{
  "_id": "result_id",
  "accuracy": 75.5,
  "estimatedIQ": 125,
  "totalTime": 480,
  "averageTimePerQuestion": 16.8,
  "iq_section": "100-150",
  "categoricalScores": {
    "pattern": 80,
    "logic": 72,
    "spatial": 78,
    "numerical": 73,
    "memory": 71,
    "abstract": 76
  },
  "cognitiveStrengths": ["pattern", "spatial"],
  "weaknesses": ["memory", "numerical"],
  "recommendations": ["Practice pattern recognition exercises"],
  "completedAt": "2026-04-30T10:15:00Z"
}
```

#### GET `/api/results/user/:userId`
Get all user's test results

**Response:** `200 OK`
```json
{
  "results": [{ /* result objects */ }]
}
```

#### GET `/api/results/stats/:userId`
Get user statistics

**Response:** `200 OK`
```json
{
  "totalTests": 5,
  "averageIQ": 123,
  "averageAccuracy": 74.2,
  "bestScore": 135,
  "improvementTrend": 8.5
}
```

## 🗄️ Database Schema

### User Collection
```typescript
{
  username: String (unique, required),
  email: String (unique, required),
  passwordHash: String (hashed, required),
  ageRange: String (enum: '10-18' | '19-45' | '46-60'),
  createdAt: Date,
  updatedAt: Date
}
```

### Question Collection
```typescript
{
  question: String (required),
  type: String (enum: 'pattern' | 'logic' | 'spatial' | 'numerical' | 'memory' | 'abstract'),
  difficulty: Number (1-10, required),
  iq_section: String (enum: '50-100' | '100-150' | '150+'),
  source: String (enum: 'dataset' | 'ai'),
  options: String[] (min 2, required),
  correct_answer: String (required),
  time_limit: Number (default: 40),
  explanation: String,
  tags: String[],
  datasetUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Test Collection
```typescript
{
  userId: ObjectId (ref: 'User'),
  iq_section: String (enum: '50-100' | '100-150' | '150+'),
  questions: ObjectId[] (ref: 'Question'),
  currentQuestionIndex: Number,
  answers: [{
    questionId: ObjectId,
    selectedAnswer: String,
    isCorrect: Boolean,
    timeSpent: Number
  }],
  startedAt: Date,
  status: String (enum: 'in_progress' | 'completed'),
  createdAt: Date,
  updatedAt: Date
}
```

### TestResult Collection
```typescript
{
  userId: ObjectId (ref: 'User'),
  testId: ObjectId (ref: 'Test'),
  iq_section: String,
  accuracy: Number (0-100),
  estimatedIQ: Number,
  totalTime: Number,
  averageTimePerQuestion: Number,
  speedVsAccuracy: {
    fast: Number,
    medium: Number,
    slow: Number
  },
  categoricalScores: {
    pattern: Number,
    logic: Number,
    spatial: Number,
    numerical: Number,
    memory: Number,
    abstract: Number
  },
  cognitiveStrengths: String[],
  weaknesses: String[],
  recommendations: String[],
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication

### Session-Based Authentication
- Uses `express-session` with MongoDB store
- Passport.js local strategy for email/password authentication
- Secure, httpOnly cookies for session management
- CORS enabled for credential requests

### Security Features
- Password hashing with bcryptjs (10 salt rounds)
- Session timeout (30 minutes)
- CSRF protection through session
- Secure cookie settings in production

### Protected Routes
All routes under `/api/tests` and `/api/results` require authentication. Unauthenticated requests return `401 Unauthorized`.

## 🧠 Adaptive Testing Algorithm

The adaptive engine dynamically adjusts question difficulty based on:

1. **Recent Performance**: Analyzes last 5 questions
2. **Accuracy Threshold**: 
   - Increase difficulty if accuracy > 70%
   - Decrease if accuracy < 35%
3. **Speed Factor**: Considers if user completes questions in < 75% of time limit
4. **Difficulty Range**: Maintains boundaries based on IQ section

### Algorithm Implementation

```typescript
- If recent_accuracy >= 70% AND speed_efficient: increase difficulty
- Else if recent_accuracy <= 35%: decrease difficulty
- Otherwise: maintain current difficulty
```

See `server/src/services/adaptiveEngine.ts` for detailed implementation.

## 📊 Analytics & IQ Estimation

### IQ Calculation Formula

```
Baseline Score = Section baseline (75/125/155)
Accuracy Component = (accuracy - 0.65) × 30  // Weighted 70%
Speed Component = (baseTime / averageTime - 1) × 10  // Weighted 30%
Final IQ = Baseline + Accuracy + Speed (clamped: 50-180)
```

### Category Scoring
- Each cognitive category scored as percentage (0-100)
- Based on correct answers / total questions per category

### Strength/Weakness Analysis
- Identifies top 2 categories as strengths
- Identifies bottom 2 categories as weaknesses
- Generates personalized recommendations

See `server/src/services/analyticsService.ts` for implementation.

## 🌐 Deployment

### Deploying to Vercel (Recommended for Frontend)

```bash
# Frontend on Vercel
vercel deploy

# Backend needs separate hosting (Heroku, Railway, AWS, etc.)
```

### Environment Variables for Production

```env
MONGODB_URI=<production-mongodb-url>
SESSION_SECRET=<strong-random-secret>
NODE_ENV=production
FRONTEND_URL=<production-frontend-url>
```

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM node:18
WORKDIR /app
COPY server/ .
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔧 Development

### Code Style
- TypeScript strict mode enabled
- ESLint configuration in place
- Consistent naming conventions

### Adding Features

1. **New Question Type**:
   - Add to cognitive categories in `constants.ts`
   - Create templates in `questionGenerator.ts`
   - Update schema if needed

2. **New API Endpoint**:
   - Create controller in `controllers/`
   - Add route in `routes/`
   - Mount route in `app.ts`

3. **Frontend Component**:
   - Create component in `src/components/`
   - Use TypeScript for type safety
   - Style with Tailwind CSS

### Testing
```bash
# Build production version
npm run build

# Check for type errors
npm run typecheck
```

### Debugging
- Enable debug mode: `DEBUG=* npm run dev`
- Check logs in browser DevTools and terminal
- Use MongoDB Compass for database inspection

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues, questions, or suggestions:
- Open an GitHub Issue
- Contact the development team
- Check existing documentation

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for reliable database
- Passport.js for authentication
- Recharts for visualization
- Framer Motion for animations

---

**Version**: 1.0.0  
**Last Updated**: 2026-04-30  
**Status**: ✅ Production Ready
