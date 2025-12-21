//TODO: Needs to be updated => Initial Readme file

# Ticket Booking Backend

A **Node.js + Express backend** for managing ticket booking operations.  
Built with **TypeScript**, **Prisma**, and follows best practices for security, logging, validation, and error handling.

**Design Decisions & Trade-offs**: For detailed architectural decisions, trade-offs, scalability considerations, and how this design achieves the assignment's availability, performance, and consistency requirements, see [`ARCHITECTURAL_DECISIONS.md`](./ARCHITECTURAL_DECISIONS.md).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Project Structure](#project-structure)

---

## Features

- Ticket inventory management (VIP, Front Row, GA)
- Booking tickets with validation
- REST API endpoints
- Input validation using **Zod**
- Structured error handling with `AppError`
- Security headers via **Helmet**
- Request logging using **Pino**
- Rate limiting and CORS support
- Health check endpoint

---

## Tech Stack

- Node.js
- TypeScript
- Express
- Prisma (with PostgreSQL)
- Zod (validation)
- Helmet (security headers)
- CORS
- Compression
- Pino / custom HTTP logger

---

## Prerequisites

- Node.js v22 or greater
- npm / yarn
- PostgreSQL v14+

---

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd ticket-booking-node-backend

# Install dependencies
npm install
# or
yarn install
```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PORT=4000
DATABASE_URL="postgresql://username:password@localhost:5432/ticket_booking_db"
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"
```

For testing, create a separate `.env.test` file:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ticket_booking_test"
PORT=4000
LOG_LEVEL=error
```

## Database Setup

1. Ensure PostgreSQL is running and create a database named `ticket_booking_db`.

2. Run Prisma migrations to set up the database schema:

```bash
npm run prisma:migrate
```

3. Generate the Prisma client:

```bash
npm run prisma:generate
```

4. (Optional) Seed the database with initial data:

```bash
npm run prisma:seed
```

### Test Database Setup

For running tests, create a separate test database:

```bash
# Create test database
createdb ticket_booking_test

# Run migrations on test database (ensure .env.test is configured)
npm run prisma:migrate
```

## Running the App

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:4000` with hot reloading enabled.

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Health Check

- **GET** `/health` - Check server status

### Tickets

- **GET** `/api/tickets` - Get all available tickets
- **POST** `/api/tickets/book` - Book tickets

#### Book Tickets Request Body

```json
{
  "userId": "user-123", // Mock user identifier (string)
  "tier": "VIP" | "FRONT_ROW" | "GA",
  "quantity": 2
}
```

## Error Handling

The application uses structured error handling with custom `AppError` class. Errors are caught by the global error handler middleware, which returns consistent JSON responses with appropriate HTTP status codes.

Common error types:

- Validation errors (400)
- Not found errors (404)
- Internal server errors (500)

## Testing

The project includes comprehensive unit and integration tests using Jest and Supertest.

### Test Environment Setup

Create a `.env.test` file in the root directory for test-specific configuration:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ticket_booking_test"
PORT=4000
LOG_LEVEL=error
```

Ensure the test database `ticket_booking_test` exists and run migrations for it:

```bash
# Create test database (if not exists)
createdb ticket_booking_test

# Run migrations on test database
npm run prisma:migrate
```

### Running Tests

Run the full test suite with coverage:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run unit tests only:

```bash
npm run test:unit
```

Run integration tests only:

```bash
npm run test:integration
```

Run tests with coverage report:

```bash
npm run test:coverage
```

Run tests for CI (single-threaded):

```bash
npm run test:ci
```

### Test Structure

- **Unit Tests** (`tests/unit/`): Test individual functions, services, and controllers in isolation
- **Integration Tests** (`tests/integration/`): Test API endpoints, database interactions, and end-to-end flows

The project uses Jest with TypeScript support. Tests are located in the `tests/` directory.

## Project Structure

```
ticket-booking-node-backend/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── server.ts              # Server entry point
│   ├── config/                # Configuration files
│   ├── constants/             # Application constants
│   ├── controllers/           # Route handlers
│   ├── db/                    # Database connection and seeds
│   ├── dtos/                  # Data transfer objects
│   ├── generated/             # Prisma generated client
│   ├── middlewares/           # Express middlewares
│   ├── repositories/          # Data access layer
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── utils/                 # Utility functions
│   └── validation/            # Input validation schemas
├── tests/                     # Test files
├── prisma/                    # Database schema and migrations
├── coverage/                  # Test coverage reports
├── package.json
├── tsconfig.json
├── jest.config.ts
└── README.MD
```
