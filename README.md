# Friday Assistant - Task Manager

A modern task management application with a React frontend and FastAPI backend. Features complete CRUD operations, priority levels, due dates, and task filtering.

## 🎯 Features

- ✅ **Add Tasks** - Create new tasks with title, description, priority, and due dates
- ✏️ **Edit Tasks** - Modify existing task details
- 🗑️ **Delete Tasks** - Remove tasks from your list
- ✓ **Complete Tasks** - Mark tasks as complete/incomplete
- 🎯 **Priority Levels** - Choose from Low, Medium, High, and Urgent priorities
- 📅 **Due Dates** - Set and track task deadlines
- 🔍 **Filtering** - Filter by status (All, Pending, Completed) and priority
- 📊 **Task Statistics** - View task summary and breakdown by priority

## 📁 Project Structure

```
friday-assistant/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Pydantic models
│   ├── database.py          # Database configuration
│   ├── task_model.py        # SQLAlchemy Task model
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── TaskManager.tsx      # React component
│   ├── TaskManager.css      # Component styles
│   └── package.json         # Node dependencies
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Backend**: Python 3.8+ and pip
- **Frontend**: Node.js 14+ and npm

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server**:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`
   - API Docs: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## 📡 API Endpoints

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (supports filtering) |
| GET | `/api/tasks/{id}` | Get a specific task |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/{id}` | Update a task |
| PATCH | `/api/tasks/{id}/complete` | Mark task as complete |
| DELETE | `/api/tasks/{id}` | Delete a task |
| GET | `/api/tasks/statistics/summary` | Get task statistics |

### Query Parameters

- `completed` (boolean) - Filter by completion status
- `priority` (string) - Filter by priority (low, medium, high, urgent)
- `skip` (integer) - Pagination offset (default: 0)
- `limit` (integer) - Number of tasks to return (default: 10)

## 📋 API Examples

### Create a Task
```bash
curl -X POST "http://localhost:8000/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project proposal",
    "description": "Finish Q2 project proposal",
    "priority": "high",
    "due_date": "2026-06-15T00:00:00",
    "completed": false
  }'
```

### Get All Pending Tasks
```bash
curl "http://localhost:8000/api/tasks?completed=false&limit=20"
```

### Update a Task
```bash
curl -X PUT "http://localhost:8000/api/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{
    "priority": "urgent",
    "completed": false
  }'
```

### Mark Task as Complete
```bash
curl -X PATCH "http://localhost:8000/api/tasks/1/complete"
```

### Delete a Task
```bash
curl -X DELETE "http://localhost:8000/api/tasks/1"
```

### Get Statistics
```bash
curl "http://localhost:8000/api/tasks/statistics/summary"
```

## 🎨 Component Features

### TaskManager Component

The React component provides:

- **Add New Task Form** - Collapsible form with validation
- **Task Filtering** - By status (All, Pending, Completed) and priority
- **Task Cards** - Display with priority indicators and due dates
- **Inline Actions** - Edit and delete buttons for each task
- **Checkbox Completion** - Quick task completion toggle
- **Responsive Design** - Works on desktop and mobile devices
- **Error Handling** - User-friendly error messages
- **Loading States** - Visual feedback during API calls

## 🔧 Environment Variables

### Backend (`.env`)
```
DATABASE_URL=sqlite:///./friday_assistant.db
# Or for PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost/friday_assistant
```

### Frontend (`.env`)
```
REACT_APP_API_URL=http://localhost:8000
```

## 🗄️ Database

The backend uses SQLAlchemy ORM with SQLite by default. To switch to PostgreSQL:

1. Update `DATABASE_URL` in `.env`
2. Install PostgreSQL driver: `pip install psycopg2-binary`
3. Create database and run migrations

## 📝 Data Models

### Task Model

```typescript
interface Task {
  id: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}
```

### Priority Levels

- **Low** - Not urgent, can be done whenever
- **Medium** - Standard priority tasks
- **High** - Important, should be completed soon
- **Urgent** - Critical, needs immediate attention

## 🎯 Usage Workflow

1. **Create a Task**
   - Click "New Task" button
   - Fill in task details
   - Click "Add Task"

2. **View Tasks**
   - Tasks display in priority order
   - Past due dates are highlighted

3. **Filter Tasks**
   - Use status filters (All/Pending/Completed)
   - Filter by priority level

4. **Complete a Task**
   - Check the checkbox next to task title
   - Task will appear struck through

5. **Edit a Task**
   - Click "Edit" button
   - Update details and click "Update Task"

6. **Delete a Task**
   - Click "Delete" button
   - Confirm deletion

## 🧪 Testing

### Backend Testing
```bash
# Run tests with pytest
pytest backend/tests/
```

### Frontend Testing
```bash
# Run tests
npm test
```

## 📦 Deployment

### Backend (using Gunicorn)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

### Frontend (Build for Production)
```bash
npm run build
# Deploy the 'build' folder to your hosting
```

## 🐛 Troubleshooting

### CORS Issues
Ensure the frontend URL is added to `CORS_ORIGINS` in `main.py`

### Database Locked
Delete `friday_assistant.db` and restart the backend to reset the database

### Port Already in Use
- Backend: Change port in uvicorn command
- Frontend: Kill process on port 3000 or use `PORT=3001 npm start`

## 📚 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open a GitHub issue.

---

Built with ❤️ by the Friday Assistant Team
