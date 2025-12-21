//TODO: Needs to be updated => Initial Readme file

# Ticket Booking Backend

A **Node.js + Express backend** for managing ticket booking operations.  
Built with **TypeScript**, **Prisma**, and follows best practices for security, logging, validation, and error handling.

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
