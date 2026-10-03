PulseChat — Real-Time Chat Application

A secure, responsive real-time chat application developed for the Arithmatrix Virtual Internship Program (AVIP) 2026 — Full Stack Development, Task 4.

PulseChat allows authenticated users to join chat rooms, exchange messages instantly, and retrieve persisted conversation history from PostgreSQL.

Features

User registration and login

bcrypt password hashing

JWT authentication for protected access

Authenticated Socket.IO connections

Real-time room-based messaging

PostgreSQL message persistence

Chat history after page refresh

Sender names and timestamps

Online-user presence count

User join/leave notifications

Typing indicators

Server-side validation with Zod

Responsive dark-theme UI

Protected chat access for unauthenticated users

Technology Stack

Frontend: React, TypeScript, Vite, Socket.IO Client, Lucide React, custom responsive CSS

Backend: Node.js, Express, TypeScript, Socket.IO, JWT, bcryptjs, Zod, pg, dotenv

Database: PostgreSQL / Neon

Tools: Git, GitHub, Postman, Visual Studio Code, Browser DevTools

Architecture & Project Structure
<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/cf38a518-19a6-4725-a4b4-f5dd0fb3b150" />


 Database

The PostgreSQL schema contains three core tables:

users — authenticated application users

chat_rooms — available chat rooms

chat_messages — persistent messages linked to users and rooms

Default rooms:

General

Developers

Announcements

Run database/schema.sql against your PostgreSQL or Neon database before starting the application.

Local Setup

Prerequisites

Node.js

npm

PostgreSQL or Neon

Git

1. Clone the repository

git clone https://github.com/ravindi5387/FSD_4_RealTimeChat_byte.git
cd FSD_4_RealTimeChat_byte

2. Configure the database

Run:

database/schema.sql

against your PostgreSQL/Neon database.

3. Configure the backend

cd backend
npm install

Create backend/.env from .env.example:

PORT=5000
DATABASE_URL=your-postgresql-connection-string
JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=1h
CLIENT_URL=http://localhost:5174

Start the backend:

npm run dev

Health check:

http://localhost:5000/api/health

Expected response:

{
  "status": "ok",
  "service": "realtime-chat-api"
}

4. Configure the frontend

Open a second terminal:

cd frontend
npm install

Create frontend/.env:

VITE_API_URL=http://localhost:5000/api

Start the frontend:

npm run dev

Open the Vite URL shown in the terminal.

API

Method

Endpoint

Auth

Purpose

GET

/api/health

None

Health check

POST

/api/auth/register

None

Register a user

POST

/api/auth/login

None

Login and receive JWT

GET

/api/auth/me

Bearer JWT

Current authenticated user

GET

/api/chat/rooms

Bearer JWT

List chat rooms

GET

/api/chat/rooms/:roomId/messages

Bearer JWT

Retrieve room history

Register

{
  "name": "Ravindi Test",
  "email": "ravindi@example.com",
  "password": "StrongPass123"
}

Login

{
  "email": "ravindi@example.com",
  "password": "StrongPass123"
}

Socket.IO Events

Client → Server

Event

Payload

Purpose

join_room

{ roomId }

Join a chat room

send_message

{ roomId, message }

Validate, persist and broadcast

typing_start

{ roomId }

Start typing indicator

typing_stop

{ roomId }

Stop typing indicator

leave_room

{ roomId }

Leave the room

Server → Client

Event

Purpose

connected

Confirms authenticated socket connection

receive_message

Delivers a persisted message

presence_update

Updates room online count

user_joined

Announces a new room member

user_left

Announces a departing member

typing_start

Shows typing activity

typing_stop

Removes typing activity

Authentication & Real-Time Flow

Register → bcrypt hash → PostgreSQL
        ↓
Login → JWT issued
        ↓
Authenticated Socket.IO connection
        ↓
Join room
        ↓
Send message
        ↓
Validate → Save to PostgreSQL → Broadcast
        ↓
Connected users receive the message instantly

Security

Passwords are stored only as bcrypt hashes.

JWT protects authenticated REST endpoints and Socket.IO connections.

Zod performs server-side validation.

Message content is limited to 1–1000 characters.

Room IDs are validated.

SQL queries use parameterized values.

CORS is controlled through CLIENT_URL.

Sensitive credentials are stored in environment variables.

.env files are excluded from version control.

Security: Never commit real DATABASE_URL values, database passwords, JWT secrets, or other credentials. Use .env.example for safe placeholders only.

Testing

The application has been tested for:

✅ Registration

✅ Login and JWT authentication

✅ Protected chat access

✅ Two-user communication in the same room

✅ Real-time message delivery without refresh

✅ Sender identification

✅ Online-user presence

✅ Message persistence in PostgreSQL

✅ Chat history after refresh

✅ Unauthorized chat access

✅ Input validation

## Screenshots / Demo Evidence

### 1. Login

![Login](screenshots/01-login.png)

### 2. Authenticated Chat Workspace

![Authenticated Chat](screenshots/02-authenticated-chat.png)

### 3. Real-Time Messaging Between Two Users

![Real-Time Messaging](screenshots/03-real-time-three-users.png.png)

### 4. Received Message

![Message Received](screenshots/04-message-received.png)

### 5. Sent Message

![Message Sent](screenshots/04-message-sent-.png)

### 6. Messages Persisted in PostgreSQL

![Database Messages](screenshots/06-database-messages.png)

### 7. Chat History After Refresh

![Chat History](screenshots/07-chat-history.png)

### 8. Unauthorized Chat Access

![Unauthorized Chat Access](screenshots/07-unauthorized-chat-access.png)

### 9. Registration Page

![Registration Page](screenshots/RagisterPage.png)

### 10. Registration After Sign In

![Registration After Sign In](<screenshots/register after sign in.png>)

Deployment

For production deployment, configure the backend with the production PostgreSQL connection and frontend origin, and configure the frontend with the deployed backend /api URL.

Backend

DATABASE_URL=your-production-postgresql-connection-string
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRES_IN=1h
CLIENT_URL=https://your-frontend-domain.example

Frontend

VITE_API_URL=https://your-backend-domain.example/api

After deployment, verify the health endpoint, registration, login, protected access, Socket.IO connection, two-user messaging, persistence, and chat history.

Project Links

GitHub: https://github.com/ravindi5387/FSD_4_RealTimeChat_byte

Live Frontend: Add after deployment

Live Backend: Add after deployment

AVIP Task 4 Deliverables

✅ Public GitHub repository

✅ Authentication before chat access

✅ Real-time messaging

✅ PostgreSQL message persistence

✅ Retrievable chat history

✅ Sender identification

✅ Multi-user room testing

✅ REST API documentation

✅ Socket.IO event documentation

✅ Screenshot evidence

⏳ Production deployment

License

Developed for educational and internship demonstration purposes as part of the Arithmatrix Virtual Internship Program (AVIP) 2026.
