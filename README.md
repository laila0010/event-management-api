# Event Management API

Backend API for managing events and user registrations built with **NestJS**, **TypeScript**, **TypeORM**, and **PostgreSQL**.

This project was developed as part of the **DIGIT Technical Technical Assessment** to demonstrate backend architecture, API design, and business rule implementation.

---

# Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Authentication:** JWT
- **API Testing:** Postman

---

# Project Architecture

## Module-Based Structure

The application follows a **modular architecture** based on NestJS best practices.  
The codebase is divided into independent modules to ensure **separation of concerns** and maintainability.

```
src
 ├── config
 │    └── database.config.ts
 │
 ├── modules
 │    ├── auth
 │    │    ├── dto
 │    │    ├── guards
 │    │    ├── strategies
 │    │    ├── auth.controller.ts
 │    │    └── auth.service.ts
 │
 │    ├── users
 │    │    ├── entities
 │    │    └── users.service.ts
 │
 │    ├── events
 │    │    ├── dto
 │    │    ├── entities
 │    │    ├── enums
 │    │    ├── events.controller.ts
 │    │    └── events.service.ts
 │
 │    ├── registrations
 │    │    ├── entities
 │    │    ├── enums
 │    │    ├── registrations.controller.ts
 │    │    └── registrations.service.ts
 │
 │    └── audit
 │         ├── entities
 │         ├── audit.controller.ts
 │         └── audit.interceptor.ts
```

---

# Key Features Implemented

### Core Features

- Event creation and management (Admin)
- Retrieve all events
- Retrieve upcoming events
- Retrieve event details
- Event registration workflow

```
Pending → Approved
```

- Retrieve event attendees

---

# Business Rules Enforcement

The following rules are enforced at the API level:

### Event Scheduling Conflict Prevention
Two events cannot be scheduled at the same date and time.

### Duplicate Registration Prevention
A user can register **only once per event**.

### Capacity Management
Registrations cannot exceed the defined `max_attendees` limit.

### Past Event Protection
Users cannot register for events that have already occurred.

---

# Optional Enhancements Implemented

Although optional, the following features were implemented:

### Authentication
JWT-based authentication allowing users to access protected endpoints.

### Role-Based Access Control (RBAC)
Administrative endpoints are protected using guards to ensure that only users with the **ADMIN role** can perform management operations.

### Audit Logging
All administrative operations (POST, PATCH, DELETE) are logged automatically using a **global NestJS interceptor**.

The audit log stores:

- Admin ID
- Operation performed
- Target entity
- Entity ID
- Timestamp

---

# Validation

All incoming requests are validated using **NestJS ValidationPipe** to ensure:

- Required fields exist
- Correct data types
- Invalid requests are rejected before reaching business logic

---

# API Endpoints

## Authentication

Register

```
POST /auth/register
```

Login

```
POST /auth/login
```

---

## Events

Create event

```
POST /events
```

Get all events

```
GET /events
```

Get upcoming events

```
GET /events/upcoming
```

Get event details

```
GET /events/:id
```

Update event

```
PATCH /events/:id
```

Delete event

```
DELETE /events/:id
```

---

## Registrations

Register for event

```
POST /registrations/:eventId
```

Approve registration

```
PATCH /registrations/:id/approve
```

Get event attendees

```
GET /registrations/event/:eventId
```

---

## Audit Logs (Admin only)

Retrieve all administrative logs

```
GET /audit-logs
```

---

# Setup Instructions

## Install dependencies

```
npm install
```

---

# Environment Variables

Create a `.env` file in the project root.

```
JWT_SECRET=supersecretkey

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=events_db
```

---

# Database Setup

Create a PostgreSQL database named:

```
events_db
```

The schema will be automatically created using **TypeORM synchronization** when the application starts.

---

# Running the Application

Development mode

```
npm run start:dev
```

Server runs on:

```
http://localhost:3000
```

---

# Postman Collection

A complete **Postman Collection** is included in the repository.

```
Event_Management_API.postman_collection.json
```

## Steps to use

1. Import the collection into Postman
2. Run the authentication endpoints
3. Use the returned JWT token for protected endpoints

---

# Assumptions, Limitations & Trade-offs

### Identity Management
The system uses a simplified **email-based authentication model** suitable for demonstration purposes.

### Audit Logging Scope
Only administrative actions are logged. User read operations are intentionally excluded.

### Timezone Handling
All event timestamps are stored in **UTC**.

### Deployment
Deployment was not implemented due to the limited timeframe but the project structure supports containerization and cloud deployment.

---

# Author

**Laila Abou Hatab**

DIGIT Technical Assessment  
March 2026