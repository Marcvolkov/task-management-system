# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack task management system with:
- **Frontend**: React SPA with Redux Toolkit (deployed on Vercel)
- **Backend**: Express.js REST API with JWT auth (deployed on Render)
- **Database**: PostgreSQL with connection pooling

## Essential Commands

### Development
```bash
# Install all dependencies (run from root)
npm run install:all

# Start development servers
npm run dev:server  # Backend on http://localhost:5000
npm run dev:client  # Frontend on http://localhost:3000

# Database setup
npm run setup-db    # Create tables and indexes
npm run test:db     # Test database connection
```

### Frontend Commands (from client/)
```bash
npm start           # Development server
npm run build       # Production build
npm test            # Run tests
npm run test:coverage  # Test coverage
```

### Backend Commands (from server/)
```bash
npm run dev         # Development with nodemon
npm start           # Production server
npm run setup-db    # Initialize database
```

### Testing & Validation
```bash
# Test deployed applications
npm run test:deployment

# No built-in linting or type checking commands exist
# Consider adding: eslint, prettier, typescript
```

## Architecture & Key Patterns

### Authentication Flow
1. JWT tokens stored in localStorage
2. Axios interceptor adds Authorization header
3. Backend middleware validates tokens
4. Protected routes use PrivateRoute component

### State Management
- Redux Toolkit with two slices: authSlice and taskSlice
- API calls through service layers (authService, taskService)
- Consistent error handling with rejectWithValue

### Database Schema
- **users**: id, username, email (case-insensitive), password_hash
- **tasks**: id, title, description, status, priority, user_id
- Indexes on user_id, status, priority, and email for performance

### API Endpoints Pattern
- All protected endpoints require JWT in Authorization header
- Base URL: `/api`
- Auth: `/api/auth/*`
- Tasks: `/api/tasks/*`
- Analytics: `/api/analytics/*`

### Smart Features
The backend includes a SmartService that provides AI-like suggestions:
- Estimates task duration based on keywords
- Suggests priority levels
- Auto-categorizes tasks
- Generates relevant tags

### Deployment Configuration
- Frontend: Vercel with SPA rewrites in vercel.json
- Backend: Render with health check at `/api`
- CORS configured for Vercel preview deployments (*.vercel.app)

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=<generated-secret>
PORT=5000
NODE_ENV=production
FRONTEND_URL=<vercel-url>
```

### Frontend (.env)
```
REACT_APP_API_URL=<render-api-url>
```

## Important Notes

1. **Email handling**: Emails are stored and compared case-insensitively
2. **CORS**: Automatically allows Vercel preview deployments
3. **Rate limiting**: 100 requests per 15 minutes per IP
4. **No TypeScript**: Project uses plain JavaScript
5. **No linting setup**: Consider adding ESLint configuration
6. **Testing**: Frontend has test setup but no tests written yet