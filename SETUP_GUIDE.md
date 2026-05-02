# IQ Assessment Platform - Quick Start Guide

## ✅ What's Been Built

A production-grade, adaptive IQ assessment web application with:

### **Backend (Express.js + MongoDB)**
- ✓ Session-based authentication (Passport.js)
- ✓ User management (signup, login, logout)
- ✓ Hybrid question system (50% dataset, 50% AI-generated)
- ✓ Adaptive difficulty engine
- ✓ Performance analytics & IQ calculation
- ✓ Test session management
- ✓ Results tracking & visualization

### **Frontend (Next.js + React + Tailwind)**
- ✓ Authentication flows (login, signup pages)
- ✓ Test section selector (IQ 50-100, 100-150, 150+)
- ✓ Interactive test interface with timer
- ✓ Progress tracking & question navigator
- ✓ Results dashboard with analytics
- ✓ Dark mode ready
- ✓ Responsive design (mobile & desktop)

### **Core Features**
- ✓ **Adaptive Difficulty**: Test difficulty adjusts based on real-time performance
- ✓ **Smart Question Generation**: Mix of dataset and AI-generated questions
- ✓ **Analytics Engine**: IQ estimation, cognitive strengths, recommendations
- ✓ **Multi-tier Testing**: 3 difficulty levels with different timing rules
- ✓ **Session Management**: Secure authentication with 30-min timeout
- ✓ **Performance Tracking**: Time per question, accuracy, consistency metrics

---

## 🚀 How to Run

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally (or connection string ready)
- Git (optional)

### Step 1: Start MongoDB
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Windows (if installed as service)
# MongoDB should auto-start, or run mongod manually

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### Step 2: Start the Backend Server
```bash
cd server
npm install  # (if not done yet)
npm run dev
```
Backend will start on `http://localhost:5000`

### Step 3: Start the Frontend
```bash
# Open a new terminal
npm install  # (if not done yet)
npm run dev
```
Frontend will start on `http://localhost:3000`

### Step 4: Access the App
Open browser and go to: `http://localhost:3000`

---

## 📝 Testing the Application

### Test User Flow
1. **Sign Up**: Create an account with:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Age Range: `19-45`

2. **Start a Test**: Select an IQ level:
   - 🟢 Basic (IQ 50-100)
   - 🟡 Advanced (IQ 100-150)
   - 🔴 Elite (IQ 150+)

3. **Take Test**: Answer questions with timer
   - Questions auto-advance after timer runs out
   - Click options to select answer
   - Timer shows in red when running out

4. **View Results**: See analytics dashboard
   - Estimated IQ
   - Accuracy %
   - Cognitive strengths/weaknesses
   - Category breakdown
   - Recommendations

---

## 🏗️ Architecture

### Backend Structure
```
server/
├── src/
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API endpoints
│   ├── controllers/    # Business logic
│   ├── services/      # AI generation, analytics
│   ├── middleware/    # Auth, error handling
│   └── config/        # Database, constants
├── package.json
└── tsconfig.json
```

### Frontend Structure
```
src/
├── app/
│   ├── (auth)/        # Login & signup pages
│   ├── (app)/         # Test & results pages
│   └── page.tsx       # Home/landing page
├── components/        # Reusable UI components
├── contexts/          # Auth context
├── lib/              # API client
└── types/            # TypeScript types
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout
- `GET /api/auth/current-user` - Get logged-in user

### Tests
- `POST /api/tests` - Create new test
- `GET /api/tests` - Get user's tests
- `GET /api/tests/:testId` - Get specific test
- `POST /api/tests/:testId/answers` - Submit answer
- `POST /api/tests/:testId/submit` - Complete test

### Results
- `GET /api/results` - Get all results
- `GET /api/results/:resultId` - Get specific result
- `GET /api/results/stats` - Get user statistics

---

## 🎯 Key Technologies

- **Frontend**: Next.js 16, React 19, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Express.js, Mongoose, Passport.js
- **Database**: MongoDB
- **Auth**: Session-based (express-session)
- **Animations**: Framer Motion
- **Charts**: Recharts

---

## 📊 Question System

### Distribution (per test)
- **30 questions total** per test session
- **50% Dataset** - From public question banks
- **50% AI-Generated** - Template-based generation

### Question Types
- Pattern Recognition
- Logic/Reasoning
- Spatial Reasoning
- Numerical Reasoning
- Memory
- Abstract Reasoning

### Difficulty Levels
- **IQ 50-100**: Difficulty 1-3 (Easier, more time)
- **IQ 100-150**: Difficulty 4-7 (Medium, balanced)
- **IQ 150+**: Difficulty 8-10 (Harder, less time)

---

## 🧠 Adaptive Engine

The test adjusts difficulty based on performance:

```
If accuracy > 80% AND time < 70% of limit
  → Increase difficulty

If accuracy < 50%
  → Decrease difficulty

Else
  → Maintain difficulty
```

Target accuracy zone: **65-75%** for optimal engagement.

---

## 📈 Analytics Calculation

### IQ Estimation
```
IQ = 100 + (15 × Z-score)
Where Z-score = (accuracy - 0.65) / std_deviation

Adjusted by:
- Section difficulty level
- Time efficiency
- Consistency
```

### Cognitive Strengths
- Ranked by category performance
- Top 2 categories identified

### Recommendations
- Auto-generated based on weak areas
- Focus on lowest-performing categories
- Speed optimization if needed

---

## ⚠️ Important Notes

### Ethical Disclaimer
This is **NOT** a clinically certified IQ test. Results are for **educational purposes only** and should not be used for professional assessment, hiring, or clinical diagnosis.

### Data Privacy
- Sessions expire after 30 minutes of inactivity
- Passwords are hashed with bcrypt (10 salt rounds)
- No sensitive data is logged

### Production Checklist
Before deploying to production:
- [ ] Change `SESSION_SECRET` in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Use environment-specific MongoDB connection
- [ ] Enable HTTPS
- [ ] Set appropriate CORS origins
- [ ] Add rate limiting
- [ ] Set up monitoring/logging
- [ ] Database backups configured
- [ ] API key management for any external services

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
Solution: Make sure MongoDB is running on localhost:27017

### CORS Error
```
Access to XMLHttpRequest blocked by CORS
```
Solution: Check `FRONTEND_URL` in server `.env` matches your frontend URL

### Port Already in Use
```
Error: listen EADDRINUSE
```
Solution: Change PORT in `.env` or kill the process using the port

### Session Cookie Not Set
- Clear browser cookies
- Check secure flag is appropriate for your environment

---

## 📚 Database Collections

### Users
```json
{
  "_id": ObjectId,
  "username": "testuser",
  "email": "test@example.com",
  "passwordHash": "bcrypt_hash",
  "ageRange": "19-45",
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### Questions
```json
{
  "_id": ObjectId,
  "question": "What is 2+2?",
  "type": "numerical",
  "difficulty": 1,
  "iq_section": "50-100",
  "source": "dataset",
  "options": ["4", "5", "6", "3"],
  "correct_answer": "4",
  "time_limit": 45,
  "explanation": "2+2 equals 4"
}
```

### Tests
```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "iq_section": "100-150",
  "startedAt": ISODate,
  "completedAt": ISODate,
  "questions": [ObjectId, ...],
  "responses": [
    {
      "questionId": ObjectId,
      "selectedAnswer": "4",
      "isCorrect": true,
      "timeSpent": 15000,
      "timestamp": ISODate
    }
  ]
}
```

### Test Results
```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "testId": ObjectId,
  "accuracy": 75.5,
  "estimatedIQ": 118,
  "categoricalScores": {
    "pattern": 80,
    "logic": 72,
    "spatial": 85
  },
  "cognitiveStrengths": ["pattern", "spatial"],
  "recommendations": ["Practice logic problems"]
}
```

---

## 🎨 UI Customization by Age

- **10-18**: Bright colors, gamified, badges
- **19-45**: Premium, modern, 3D-inspired
- **46-60**: Accessible, large fonts, high contrast

Currently using the 19-45 design. To customize:
Edit `/src/contexts/ThemeContext.tsx` (to be created in next phase)

---

## 🚀 Next Steps (If Continuing)

1. **Testing**: Run full end-to-end tests
2. **Styling**: Fine-tune age-based UI
3. **Performance**: Optimize bundle size, lazy-load charts
4. **Features**: Add test history, leaderboard
5. **Deployment**: Deploy to Vercel (frontend) + Railway/Render (backend)

---

## 📞 Support

For issues or questions, check:
1. Console errors (browser DevTools)
2. Server logs (terminal)
3. MongoDB connection
4. Environment variables

---

**Happy Testing! 🎯**
