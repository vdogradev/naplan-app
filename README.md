# NAPLAN Practice Hub - Full Stack Application

A production-ready, AI-powered NAPLAN test preparation platform built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Tech Stack

### Frontend
- **React 18** + **TypeScript** - Modern UI development
- **Vite** - Fast build tool and dev server
- **React Query** - Server state management
- **Zustand** - Client state management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Recharts** - Analytics and charts
- **Framer Motion** - Animations

### Backend
- **Node.js** + **Express** - API server
- **TypeScript** - Type safety
- **MongoDB** + **Mongoose** - Primary database
- **Redis** - Caching and sessions
- **JWT** - Authentication
- **Winston** - Logging

### AI Integration
- **Hugging Face Inference API** - AI-powered analysis
- Custom AI analysis algorithms

### Deployment (Free Tier)
- **Vercel** - Frontend hosting
- **Render** or **Railway** - Backend hosting
- **MongoDB Atlas** - Database
- **Redis Cloud** - Caching

## 📁 Project Structure

```
naplan-app/
├── backend/               # Node.js + Express API
│   ├── src/
│   │   ├── config/       # Database & Redis config
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Auth & validation
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # AI service
│   │   └── utils/        # Helpers
│   ├── .env.example      # Environment template
│   └── package.json
│
├── frontend/             # React + TypeScript
│   ├── src/
│   │   ├── components/   # Reusable UI
│   │   ├── pages/        # Route pages
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API calls
│   │   ├── store/        # Zustand stores
│   │   └── types/        # TypeScript types
│   ├── .env.example      # Environment template
│   └── package.json
│
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Git installed
- Free accounts on:
  - [MongoDB Atlas](https://www.mongodb.com/atlas)
  - [Redis Cloud](https://redis.com/try-free/)
  - [Hugging Face](https://huggingface.co/)
  - [Vercel](https://vercel.com)
  - [Render](https://render.com) or [Railway](https://railway.app)

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd naplan-app

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

#### Backend (.env file)
```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas (get from mongodb.com/atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/naplan-app

# Redis Cloud (get from redis.com)
REDIS_HOST=your-redis-host.redis-cloud.com
REDIS_PORT=16930
REDIS_PASSWORD=your-redis-password

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-key-min-32-characters

# Hugging Face (get from huggingface.co/settings/tokens)
HUGGINGFACE_API_KEY=your-api-key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env file)
```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This will populate your MongoDB with sample questions.

### 4. Run Development Servers

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## 📊 Database Schema

### User
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  avatar: String,
  yearLevel: Number (3 or 7),
  preferences: {
    timeLimit: Number,
    difficulty: String
  }
}
```

### Question
```javascript
{
  yearLevel: Number,
  topic: String (number|measurement|geometry|statistics),
  type: String (multiple|text),
  question: String,
  choices: [String],
  acceptableAnswers: [String],
  correctAnswer: String,
  explanation: String,
  difficulty: String,
  points: Number
}
```

### Attempt
```javascript
{
  userId: ObjectId,
  quizType: String,
  mode: String,
  questions: [QuestionResponse],
  score: Number,
  accuracy: Number,
  topicResults: Object,
  completed: Boolean
}
```

## 🚀 Deployment Guide

### Step 1: Deploy Backend to Render

1. Go to [Render.com](https://render.com) and sign up
2. Click "New Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: naplan-backend
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add environment variables (copy from your `.env` file)
6. Click "Create Web Service"
7. Wait for deployment (takes 2-3 minutes)
8. Copy the deployed URL (e.g., `https://naplan-backend.onrender.com`)

### Step 2: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com) and sign up
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.render.com/api`
6. Click "Deploy"
7. Wait for deployment (takes 1-2 minutes)

### Step 3: Update CORS (Important!)

After deploying frontend, update your backend environment variable:

1. Go to Render dashboard
2. Click your backend service
3. Go to "Environment" tab
4. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
5. Click "Save Changes"
6. Service will redeploy automatically

### Step 4: Seed Production Database

```bash
# Update your local .env with production MongoDB URI
# Then run:
cd backend
npm run seed
```

## 💰 Free Tier Limits

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Vercel** | Hobby | 100GB bandwidth, 6,000 build minutes/month |
| **Render** | Web Service | 512 MB RAM, sleeps after 15 min inactivity |
| **MongoDB Atlas** | M0 (Shared) | 512 MB storage, shared RAM |
| **Redis Cloud** | 30MB | 30 MB memory, 1 database |
| **Hugging Face** | Inference API | Rate limited, but generous |

**Note**: Render's free tier sleeps after 15 minutes of inactivity. First request after sleep takes ~30 seconds to wake up.

## 🔧 Development Commands

### Backend
```bash
cd backend
npm run dev          # Start with hot reload
npm run build        # Compile TypeScript
npm start           # Start production server
npm run seed        # Seed database with questions
```

### Frontend
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🧪 Testing

### API Testing (using curl)

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Get questions
curl http://localhost:5000/api/quiz/questions/3
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check your IP is whitelisted in MongoDB Atlas
- Verify connection string format
- Ensure password doesn't have special characters (or URL encode them)

### CORS Errors
- Verify `FRONTEND_URL` matches your actual frontend URL
- Check protocol (http vs https)

### Redis Connection Error
- App works without Redis (falls back to in-memory)
- Check Redis Cloud credentials
- Verify you're using the correct port

### Build Failures
- Ensure Node.js 18+ is installed
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npx tsc --noEmit`

## 📝 Next Steps

1. **Add More Questions**: Edit `backend/src/scripts/seedQuestions.ts` and add your NAPLAN questions
2. **Customize AI Prompts**: Modify `backend/src/services/aiService.ts` for better recommendations
3. **Add Authentication**: Implement JWT refresh tokens
4. **Add Tests**: Use Jest for unit testing
5. **Add Analytics**: Track user progress with charts
6. **Mobile App**: Consider React Native for mobile

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB University](https://university.mongodb.com) (free courses)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use for educational purposes!

## 🆘 Support

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review deployment platform documentation
3. Create an issue in the GitHub repository

---

**Built with ❤️ for Australian students preparing for NAPLAN**