# Task 4 Test Plan

## Authentication

1. Register a new user → expect `201 Created`.
2. Try duplicate email → expect `409 Conflict`.
3. Login with valid credentials → expect `200 OK` + JWT.
4. Call `/api/auth/me` without token → expect `401`.

## Chat Rooms

1. Login.
2. Load `/api/chat/rooms` with Bearer token.
3. Select a room.
4. Load `/api/chat/rooms/:roomId/messages`.

## Real-Time

1. Open Browser A and Browser B.
2. Login with two accounts.
3. Join the same room.
4. Send a message from Browser A.
5. Confirm Browser B receives it without page refresh.
6. Confirm the message is stored in `chat_messages`.
7. Refresh Browser B and verify the message remains in history.
8. Join/leave and verify presence count updates.

## Basic Concurrency

Use 2–5 browser tabs/sessions in the same room and send messages rapidly. The expected result is that the server keeps the connections active and each message is persisted and broadcast without unhandled server errors.
