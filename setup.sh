#!/bin/bash

echo "🚀 NAPLAN Practice Hub - Setup Script"
echo "======================================"
echo ""

# Check Node.js version
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
echo "✅ Backend dependencies installed"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✅ Frontend dependencies installed"
echo ""

# Create environment files if they don't exist
echo "🔧 Setting up environment files..."
cd ../backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created backend/.env (please edit with your values)"
else
    echo "ℹ️  backend/.env already exists"
fi

cd ../frontend
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Created frontend/.env.local (please edit with your values)"
else
    echo "ℹ️  frontend/.env.local already exists"
fi

echo ""
echo "======================================"
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo ""
echo "1. Set up your environment variables:"
echo "   - Edit backend/.env with your MongoDB, Redis, and JWT credentials"
echo "   - Edit frontend/.env.local with your API URL"
echo ""
echo "2. Get free accounts at:"
echo "   - MongoDB Atlas: https://www.mongodb.com/atlas"
echo "   - Redis Cloud: https://redis.com/try-free/"
echo "   - Hugging Face: https://huggingface.co/"
echo ""
echo "3. Start development servers:"
echo "   - Backend: cd backend && npm run dev"
echo "   - Frontend: cd frontend && npm run dev"
echo ""
echo "4. Open http://localhost:5173 in your browser"
echo ""
echo "📖 Full documentation: README.md"
echo ""
echo "Happy coding! 🎓"