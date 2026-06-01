# FRIDAY AI Assistant - API Documentation

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication

All endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password",
  "preferred_language": "en"
}
```

**Response:**
```json
{
  "id": "uuid",
  "username": "john_doe",
  "email": "john@example.com",
  "access_token": "token",
  "token_type": "bearer"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}
```

### Tasks

#### Get All Tasks
```http
GET /tasks?status=PENDING&priority=HIGH
Authorization: Bearer <token>
```

#### Create Task
```http
POST /tasks
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "HIGH",
  "due_date": "2024-01-15T10:00:00Z"
}
```

#### Update Task
```http
PUT /tasks/{task_id}
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Buy groceries",
  "status": "COMPLETED"
}
```

#### Delete Task
```http
DELETE /tasks/{task_id}
Authorization: Bearer <token>
```

### Reminders

#### Create Reminder
```http
POST /reminders
Content-Type: application/json
Authorization: Bearer <token>

{
  "task_id": "uuid",
  "reminder_time": "2024-01-15T09:00:00Z",
  "is_recurring": false
}
```

#### Get Reminders
```http
GET /reminders
Authorization: Bearer <token>
```

### Memory

#### Save Memory
```http
POST /memory
Content-Type: application/json
Authorization: Bearer <token>

{
  "key": "favorite_music_genre",
  "value": {"genres": ["indie", "rock"]}
}
```

#### Get Memory
```http
GET /memory/{key}
Authorization: Bearer <token>
```

### Chat

#### Send Message
```http
POST /chat
Content-Type: application/json
Authorization: Bearer <token>

{
  "message": "What's the weather?",
  "language": "en"
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_message": "What's the weather?",
  "assistant_response": "It's 25°C and sunny...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### WebSocket

#### Connect to Voice Chat
```javascript
const ws = new WebSocket('ws://localhost:8000/ws');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'start_voice',
    user_id: 'uuid'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle response
};
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid input",
  "errors": [
    {"field": "email", "message": "Invalid email format"}
  ]
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "detail": "Rate limit exceeded"
}
```

## Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Success, no content
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limited
- `500 Internal Server Error` - Server error

## Rate Limiting

- 1000 requests per hour per user
- 100 WebSocket connections per user
- 10 voice requests per minute

## Pagination

For list endpoints:
```http
GET /tasks?page=1&limit=20&sort=created_at&order=desc
```

## Filtering

Supported filters:
- `status`: PENDING, IN_PROGRESS, COMPLETED
- `priority`: LOW, MEDIUM, HIGH
- `date_range`: start_date, end_date
- `search`: text search

## Testing

Access interactive API docs:
```
http://localhost:8000/docs (Swagger UI)
http://localhost:8000/redoc (ReDoc)
```
