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
- **Payment Simulation**: Mock payment processing with success/failure scenarios (90% success rate)
- REST API endpoints
- Input validation using **Zod**
- Structured error handling with `AppError`
- Security headers via **Helmet**
- Request logging using **Pino**
- Rate limiting and CORS support
- Health check endpoint
- **Concurrency Control**: Row-level locking prevents double-booking and race conditions
- **Transactional Integrity**: Database transactions ensure atomic booking operations

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
- PostgreSQL v14+ (for local setup) or Docker (for containerized setup)

---

## Quick Start

### Option 1: Run with Local PostgreSQL Database

1. **Set up PostgreSQL locally**:
   - Install and start PostgreSQL v14+ on your machine.
   - Create a database named `ticket_booking`.

2. **Configure environment**:
   - Copy `.env.backup` to `.env` in the root directory.
   - Update the `DATABASE_URL` to match your local PostgreSQL credentials (default: `postgresql://postgres:postgres@localhost:5432/ticket_booking`).

3. **Install dependencies and set up database**:
   ```bash
   npm install
   npm run prisma:migrate
   npm run prisma:generate
   npm run prisma:seed  # Optional: seed initial data
   ```

4. **Start the Express app locally**:
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:4000`.

### Option 2: Run with Docker (Development Sample)

For a quick development setup with containerized PostgreSQL and Express app, use Docker Compose. **Note**: This is a simple sample configuration for development purposes only and may not be suitable for production.

1. **Configure environment**:
   - Copy `.env.backup` to `.env` in the root directory.
   - Ensure the `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` variables are set (defaults provided).
   - The `DATABASE_URL` should point to the database service: `postgresql://postgres:postgres@db:5432/ticket_booking`.

2. **Start with Docker Compose**:
   ```bash
   docker-compose up --build
   ```
   - The Express app will be available on `http://localhost:4000`.
   - PostgreSQL will run in a container on port `5432`.

3. **Stop the containers**:
   ```bash
   docker-compose down
   ```

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

Create a `.env` file in the root directory based on `.env.backup`. The following variables are required:

```env
# Database connection URL
# For local development: use localhost
# For Docker: use db (the database service name)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ticket_booking"

# Server port
PORT=4000

# Logging level (error, warn, info, debug)
LOG_LEVEL=error

# Node environment
NODE_ENV=development

# Allowed origins for CORS (comma-separated URLs)
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"

# PostgreSQL credentials (required only for Docker Compose setup)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ticket_booking
```

### ⚠️ **Important: Database URL Configuration**

**When running locally** (Option 1):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ticket_booking"
```

**When running with Docker** (Option 2):
```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/ticket_booking"
```

**Why `db` instead of `localhost` in Docker?**
- `db` is the **service name** defined in `docker-compose.yml`
- Docker's internal networking resolves `db` to the database container's IP
- `localhost` would point to the app container itself, not the database

- For **local PostgreSQL setup** (Option 1 in Quick Start), only `DATABASE_URL`, `PORT`, `LOG_LEVEL`, `NODE_ENV`, and `ALLOWED_ORIGINS` are required. Update `DATABASE_URL` with your local database credentials.
- For **Docker setup** (Option 2 in Quick Start), all variables including the `POSTGRES_*` ones are needed for the containerized database.

For testing, create a separate `.env.test` file:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ticket_booking_test"
PORT=4000
LOG_LEVEL=error
NODE_ENV=test
ALLOWED_ORIGINS="http://localhost:3000"
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

#### Payment Processing

**Note**: For assignment demonstration purposes, payment processing is **simulated** with a 90% success rate and 10% failure rate. In a production system, this would integrate with real payment gateways like Stripe or PayPal.

- **Payment Simulation**: Random success/failure with 100ms processing delay
- **Transaction Rollback**: Failed payments automatically rollback inventory changes
- **Production Integration**: Would require PCI compliance and webhook handling for real payment processing

### Concurrency and Race Condition Handling

The booking system implements robust concurrency control to prevent double-booking and race conditions:

- **Row-Level Locking**: Uses PostgreSQL's `SELECT ... FOR UPDATE` to lock ticket inventory rows during booking operations
- **Transactional Integrity**: All booking operations are wrapped in database transactions ensuring atomicity
- **Race Condition Prevention**: Multiple concurrent requests for the same tickets are serialized, ensuring only valid bookings succeed
- **Testing**: Comprehensive concurrency tests validate behavior under high load scenarios

**Note**: Request idempotency (handling duplicate requests from the same client) was considered but not implemented. For production systems, consider adding idempotency keys to prevent accidental duplicate bookings from network retries or form resubmissions.

For detailed implementation details, see the [Concurrency Handling](#consistency--concurrency-handling) section in `ARCHITECTURAL_DECISIONS.md`.

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

## Absolute Path Imports

This project uses absolute path imports with the `@/` alias for cleaner and more maintainable code. The configuration is set up in `tsconfig.json` and `jest.config.ts`.

### Import Examples

Instead of relative imports like:
```typescript
import { createTicketService } from "../services/ticket.service";
import { BookTicketsRequestDto } from "../dtos/book-ticket.dto";
```

Use absolute imports:
```typescript
import { createTicketService } from "@/services/ticket.service";
import { BookTicketsRequestDto } from "@/dtos/book-ticket.dto";
```

### Available Path Aliases

- `@/*` - Root of src directory
- `@/controllers/*` - Controllers directory
- `@/services/*` - Services directory
- `@/repositories/*` - Repositories directory
- `@/routes/*` - Routes directory
- `@/middlewares/*` - Middlewares directory
- `@/dtos/*` - DTOs directory
- `@/utils/*` - Utils directory
- `@/constants/*` - Constants directory
- `@/validation/*` - Validation directory
- `@/db/*` - Database directory
- `@/generated/*` - Generated files directory
