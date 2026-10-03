PulseChat — Real-Time Chat Application

Arithmatrix Virtual Internship Program (AVIP) 2026 — Full Stack Development — Task 4

A secure, responsive, real-time chat application built with React, TypeScript, Node.js, Express, Socket.IO, JWT authentication, bcryptjs, Zod, and PostgreSQL.

PulseChat allows authenticated users to join chat rooms, exchange messages instantly, persist conversations in PostgreSQL, and reload message history across page refreshes.

Project Status

Area

Status

User authentication

✅ Implemented

JWT authentication

✅ Implemented

Password hashing

✅ Implemented

Chat rooms

✅ Implemented

Real-time messaging

✅ Implemented

Message persistence

✅ Implemented

Chat history

✅ Implemented

Sender identification

✅ Implemented

Presence / online count

✅ Implemented

Typing indicator

✅ Implemented

Unauthorized chat protection

✅ Implemented

Production deployment

⏳ To be completed

AVIP Task 4 Requirements

The implementation addresses the required Task 4 capabilities:

User authentication before joining chat

Real-time text messaging between users within rooms

Message persistence in a datastore

Retrievable chat history with sender identification

Basic multi-user room handling

README documentation for REST APIs and Socket.IO events

Screenshot / demo evidence

These requirements are aligned with the AVIP 2026 Task 4 specification.

Key Features

Authentication & Security

User registration and login

Password hashing with bcryptjs

JWT-based authentication

Protected REST endpoints

JWT validation during Socket.IO connection handshake

Server-side request validation with Zod

CORS controlled through an environment variable

Parameterized PostgreSQL queries

Real-Time Communication

Socket.IO real-time communication

Authenticated socket connections

Room-based messaging

Instant message broadcast to connected room members

Online user count

User join / leave notifications

Typing indicators

Automatic Socket.IO reconnection

Persistence & History

Messages stored in PostgreSQL

Sender information returned with message history

Chat history retrieved through a protected REST endpoint

Messages remain available after browser refresh

User Experience

Professional dark-theme interface

Responsive layout for desktop and smaller screens

Clear sent / received message styling

Sender name and timestamp display

Connection status indicator

Empty-state chat experience

Technology Stack

Frontend

React 19

TypeScript

Vite

Socket.IO Client

Lucide React

Custom responsive CSS

Backend

Node.js

Express 5

TypeScript

Socket.IO 4

JWT (jsonwebtoken)

bcryptjs

Zod

PostgreSQL client (pg)

dotenv

Database

PostgreSQL

Neon PostgreSQL compatible configuration

Development & Testing

Visual Studio Code

Postman

Git

GitHub

Browser DevTools

System Architecture

┌──────────────────────────────────────┐
│ React + TypeScript + Vite │
│ PulseChat UI │
└───────────────────┬──────────────────┘
│
HTTP REST API
│
│ Socket.IO
│ │
▼ ▼
┌──────────────────────────┐
│ Node.js + Express + TS │
│ │
│ JWT Authentication │
│ Zod Validation │
│ Socket.IO Server │
└────────────┬─────────────┘
│
▼
┌────────────────────┐
│ PostgreSQL / Neon │
│ │
│ users │
│ chat_rooms │
│ chat_messages │
└────────────────────┘

Application Flow

Register
↓
Password hashed with bcryptjs
↓
User stored in PostgreSQL
↓
Login
↓
JWT issued
↓
Authenticated chat session
↓
Connect to Socket.IO
↓
Join chat room
↓
Send message
↓
Validate message
↓
Store message in PostgreSQL
↓
Broadcast message to room
↓
Connected users receive message instantly

Project Structure

FSD_4_RealTimeChat_byte/
│
├── backend/
│ ├── src/
│ │ ├── config/
│ │ │ ├── db.ts
│ │ │ └── env.ts
│ │ ├── controllers/
│ │ │ ├── authController.ts
│ │ │ └── chatController.ts
│ │ ├── middleware/
│ │ │ └── authMiddleware.ts
│ │ ├── routes/
│ │ │ ├── authRoutes.ts
│ │ │ └── chatRoutes.ts
│ │ ├── sockets/
│ │ │ └── chatSocket.ts
│ │ ├── types/
│ │ │ ├── auth.ts
│ │ │ └── chat.ts
│ │ ├── utils/
│ │ │ └── jwt.ts
│ │ ├── app.ts
│ │ └── server.ts
│ ├── .env.example
│ ├── package.json
│ └── tsconfig.json
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── AuthShell.tsx
│ │ │ ├── ChatHeader.tsx
│ │ │ ├── ChatSidebar.tsx
│ │ │ ├── MessageBubble.tsx
│ │ │ └── MessageComposer.tsx
│ │ ├── pages/
│ │ │ ├── AuthPage.tsx
│ │ │ └── ChatPage.tsx
│ │ ├── services/
│ │ │ └── api.ts
│ │ ├── types/
│ │ │ └── index.ts
│ │ ├── App.tsx
│ │ ├── main.tsx
│ │ └── styles.css
│ ├── .env.example
│ ├── index.html
│ ├── package.json
│ ├── tsconfig.json
│ └── vite.config.ts
│
├── database/
│ └── schema.sql
│
├── docs/
│ └── TEST_PLAN.md
│
├── screenshots/
├── .gitignore
├── README.md
└── START_HERE_SINHALA.txt

Database Design

users

Stores authenticated application users.

Column

Description

id

Primary key

name

User display name

email

Unique login email

password_hash

bcrypt password hash

created_at

Account creation timestamp

chat_rooms

Stores available chat rooms.

Column

Description

id

Primary key

name

Unique room name

description

Room description

created_at

Room creation timestamp

chat_messages

Stores persistent chat messages.

Column

Description

id

Message primary key

room_id

Foreign key to chat_rooms

sender_id

Foreign key to users

message

Message content, max 1000 characters

created_at

Message timestamp

Relationships

users
│
└──────────────┐
▼
chat_messages
▲
│
chat_rooms

The database schema also seeds the default rooms:

General

Developers

Announcements

Local Setup

Prerequisites

Node.js 20+

npm

PostgreSQL or a Neon PostgreSQL database

Git

1. Clone the repository

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd FSD_4_RealTimeChat_byte

2. Configure the database

Run the SQL script in:

database/schema.sql

against your PostgreSQL / Neon database.

3. Configure the backend

cd backend
npm install

Create a .env file from .env.example:

PORT=5000
DATABASE_URL=your-postgresql-connection-string
JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=1h
CLIENT_URL=http://localhost:5174

Set CLIENT_URL to the exact local frontend origin used by Vite. For example, if Vite is running on 5174, use http://localhost:5174.

Start the backend:

npm run dev

4. Configure the frontend

In a second terminal:

cd frontend
npm install

Create .env from .env.example:

VITE_API_URL=http://localhost:5000/api

Start the frontend:

npm run dev

Open the URL printed by Vite, for example:

http://localhost:5174

Build Commands

Backend

cd backend
npm run build
npm start

Frontend

cd frontend
npm run build
npm run preview

REST API

All chat REST endpoints except health and authentication are protected by a Bearer JWT.

Method

Endpoint

Auth

Description

GET

/api/health

No

API health check

POST

/api/auth/register

No

Create a new user

POST

/api/auth/login

No

Authenticate and receive JWT

GET

/api/auth/me

Bearer JWT

Get the current authenticated user

GET

/api/chat/rooms

Bearer JWT

Retrieve available chat rooms

GET

/api/chat/rooms/:roomId/messages

Bearer JWT

Retrieve chat history for a room

Health Check

GET /api/health

Example response:

{
"status": "ok",
"service": "realtime-chat-api"
}

Register

POST /api/auth/register
Content-Type: application/json

{
"name": "Ravindi Test",
"email": "ravindi@example.com",
"password": "StrongPass123"
}

Login

POST /api/auth/login
Content-Type: application/json

{
"email": "ravindi@example.com",
"password": "StrongPass123"
}

Protected User Endpoint

GET /api/auth/me
Authorization: Bearer <JWT_TOKEN>

Chat Rooms

GET /api/chat/rooms
Authorization: Bearer <JWT_TOKEN>

Chat History

GET /api/chat/rooms/1/messages
Authorization: Bearer <JWT_TOKEN>

HTTP Status Codes

Status

Usage

200 OK

Successful login, protected reads, and health check

201 Created

Successful registration

400 Bad Request

Invalid or missing input

401 Unauthorized

Missing, invalid, or expired authentication

404 Not Found

Unknown route or room

409 Conflict

Duplicate email during registration

500 Internal Server Error

Unexpected server/database error

Socket.IO Events

Client → Server

Event

Payload

Description

join_room

{ roomId }

Join a valid chat room

send_message

{ roomId, message }

Validate, persist, and broadcast a message

typing_start

{ roomId }

Notify room members that the user is typing

typing_stop

{ roomId }

Stop the typing indicator

leave_room

{ roomId }

Leave a chat room

Server → Client

Event

Payload / Data

Description

connected

{ userId, message }

Confirms authenticated socket connection

receive_message

Message object

Delivers a persisted message to room members

presence_update

{ roomId, onlineCount }

Updates room presence count

user_joined

User and room data

Announces a new room member

user_left

User and room data

Announces when a user leaves

typing_start

User and room data

Displays typing activity

typing_stop

User and room data

Removes typing activity

Socket Authentication

The frontend sends the JWT token during the Socket.IO handshake:

io(SOCKET_URL, {
auth: {
token
},
transports: ['websocket', 'polling'],
reconnection: true
});

The server validates the token before accepting the connection. Invalid, missing, or expired tokens are rejected.

Real-Time Messaging Flow

User logs in
↓
JWT token issued
↓
Frontend opens authenticated Socket.IO connection
↓
User joins a room
↓
User sends a message
↓
Zod validates room ID + message content
↓
Message is inserted into PostgreSQL
↓
Server emits receive_message to the room
↓
Connected room members receive the message instantly

Persistence & History Flow

User opens room
↓
GET /api/chat/rooms/:roomId/messages
↓
Protected API validates JWT
↓
PostgreSQL retrieves room messages
↓
Messages returned with sender name + timestamp
↓
Frontend renders chat history

Multi-User Handling

The application supports basic concurrent room usage through Socket.IO rooms.

When users join a room, the server:

Adds the socket to the room.

Notifies existing room members.

Calculates connected sockets for the room.

Broadcasts the current online count.

Delivers persisted messages to all connected room members.

This provides the basic simultaneous-user behavior required for the internship task.

Security Measures

Passwords are never stored as plaintext; they are hashed with bcryptjs.

JWTs protect authenticated REST endpoints.

JWTs are validated before accepting Socket.IO connections.

Zod performs server-side input validation.

Chat messages are trimmed and limited to 1–1000 characters.

Room IDs are validated as positive integers.

SQL queries use parameterized values.

CORS is configured from CLIENT_URL.

Database credentials and JWT secrets are loaded from environment variables.

.env files are excluded from version control.

Security Note

Never commit real values for:

DATABASE_URL
JWT_SECRET

Use .env.example only for safe placeholders.

Testing Checklist

The following local tests have been performed during development:

Registration succeeds with valid input

Login succeeds and returns a JWT

Chat access requires authentication

Two authenticated users can enter the same room

Real-time messages are delivered without page refresh

Sender names are displayed

Online user count updates

Chat history remains available after refresh

Messages are stored in PostgreSQL

Invalid chat access redirects the user to authentication

Invalid message input is validated

Demo Evidence / Screenshots

Store demonstration images in:

screenshots/

Recommended evidence set:

Login page

Registration page

Authenticated chat workspace

Two-user real-time messaging

Sent message

Received message

Chat history after refresh

PostgreSQL stored messages

Unauthorized chat access

API testing

Screenshot Gallery

Rename the local evidence files to the names below before publishing the README so the links resolve correctly on GitHub.

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

The production deployment is intentionally kept as a separate configuration step after local functional testing.

Backend Production Variables

PORT=5000
DATABASE_URL=postgresql://neondb_owner:npg_ZoH8pTmXK2CA@ep-quiet-feather-b4eitoyw-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=cff802229122aea4c48a230ff7048d9d5427240970a4ce0dd7e4177531003a98
JWT_EXPIRES_IN=1h
CLIENT_URL=http://localhost:5173

Frontend Production Variable

VITE_API_URL=https://your-backend-domain.example/api

Post-Deployment Verification

After deployment, verify the following in order:

GET /api/health

User registration

User login

Protected /api/auth/me

Chat room loading

Authenticated Socket.IO connection

Two-user real-time messaging

Message persistence

Chat history after refresh

Use a hosting platform that supports the Socket.IO / WebSocket behavior required by the application. Confirm the provider's current runtime limitations before production deployment.

Project URLs

Live Frontend

Pending deployment

Live Backend

Pending deployment

GitHub Repository

Pending repository publication

AVIP Deliverables Checklist

Task 4 requirements implemented

Public-ready project structure

REST API documentation

Socket.IO event documentation

Authentication before chat access

Real-time messaging

PostgreSQL message persistence

Chat history

Sender identification

Multi-user room testing

Screenshot evidence prepared

GitHub repository published

Production deployment completed

Live URL added to README

AVIP dashboard submission completed

Learning Outcomes Demonstrated

This project demonstrates practical experience with:

Full-stack application architecture

REST API development

JWT authentication

Password hashing

WebSocket-based real-time communication

PostgreSQL data persistence

Server-side validation

Responsive UI development

Multi-user communication flows

Debugging and deployment preparation

License

Developed for educational and internship demonstration purposes as part of the Arithmatrix Virtual Internship Program (AVIP) 2026.
