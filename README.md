# User Authentication Microservice

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

A robust user authentication and management microservice built with NestJS .

## Features

- User registration and authentication
- JWT-based authorization
- User profile management
- Secure password handling

## Tech Stack

- NestJS framework
- TypeScript
- TypeORM for database interaction
- PostgreSQL database
- Microservice architecture

## Project Structure

```
tw-auth/
├─ src/
│  ├─ apis/            # API modules
│  │  ├─ auth/         # User module with controller, service, DTOs, and entities
│  ├─ core/            # Core functionality
│  │  ├─ auth/         # Authentication module
│  │  ├─ common/       # Shared DTOs and utilities
│  │  ├─ db/           # Database configuration and migrations
│  ├─ app.module.ts    # Main application module
│  └─ main.ts          # Application entry point
```

## Installation

```bash
$ npm install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432           # Default PostgreSQL port
DB_USERNAME=user       # Your database username
DB_PASSWORD=user       # Your database password
DB_DATABASE=db_name    # Your database name

<!-- # JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=3600    # Token expiration time in seconds

# Optional: Redis Configuration (if using)
REDIS_HOST=localhost
REDIS_PORT=6379
``` -->

## Running the Application

```bash
# Development mode
$ npm run start

# Watch mode (auto-reload on changes)
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## Database Migrations

```bash
# Generate a migration
$ npm run migration:generate

# Run migrations
$ npm run migrations:run
```


## Integration with Any System

This microservice handles all user management and authentication for All kind of Systems. It exposes RESTful APIs that can be consumed by other microservices and client applications.

Key responsibilities:

- User registration and login
- Authentication token issuance and validation
- User profile management
- Access control and permissions

## API Endpoints

| Endpoint         | Method | Description                     |
| ---------------- | ------ | ------------------------------- |
| `/auth/register` | POST   | Create a new user account       |
| `/auth/login`    | POST   | Authenticate user and get token |
| `/user/profile`  | GET    | Get current user profile        |
| `/user/profile`  | PATCH  | Update user profile             |

For full API documentation, run the application and visit `/api-docs` (Swagger yet not configured, [upcoming]).
