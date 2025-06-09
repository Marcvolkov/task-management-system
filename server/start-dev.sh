#!/bin/bash
export JWT_SECRET=my_secret_key_for_development
export PORT=3001
export DATABASE_URL="postgresql://markvolkov909@localhost:5432/task_management"
export NODE_ENV=development

echo "🚀 Starting Task Management Server in development mode..."
echo "📍 Port: $PORT"
echo "🗄️  Database: task_management"
echo "─────────────────────────────────────────────────"

npm run dev 