# task-management
# Task Management Application

A full-stack task management app with a Node.js/Express backend and a React/Vite frontend.

## Project Structure

```
task-management/
  backend/    # Node.js + Express REST API
  frontend/   # React + Vite SPA
```

### Backend

- RESTful API for user authentication and task management.
- Organized into controllers, middleware, models, and routes.
- MongoDB connection via `config/db.js`.

#### Main Features

- User registration and login (`authController.js`, `authRoutes.js`)
- JWT-based authentication (`authMiddleware.js`)
- Task CRUD operations (`taskController.js`, `taskRoutes.js`)
- Error handling middleware

### Frontend

- Built with React and Vite.
- Pages: Dashboard, Login, Register.
- Components: AuthLayout, Layout, TaskCard.
- Context: AuthContext for managing authentication state.

#### Main Features

- User authentication (login/register)
- Dashboard for managing tasks
- Responsive UI

## Getting Started

### Backend

1. Install dependencies:
	```bash
	cd backend
	npm install
	```
2. Start the server:
	```bash
	npm start
	```

### Frontend

1. Install dependencies:
	```bash
	cd frontend
	npm install
	```
2. Start the development server:
	```bash
	npm run dev
	```

## License

MIT
