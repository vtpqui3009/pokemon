# Pokémon Fullstack Application

This repository contains a fullstack Pokémon application, with a [NestJS](https://nestjs.com/) backend and an [Angular](https://angular.dev/) frontend.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Implemented Features](#implemented-features)
- [Deployment](#deployment)
- [Resources](#resources)
- [License](#license)

---

## Project Structure

```
.
├── backend/   # NestJS API server
└── frontend/  # Angular client application
```

---

## Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)
- [Angular CLI](https://angular.dev/tools/cli) (for frontend)
- [NestJS CLI](https://docs.nestjs.com/cli/overview) (optional, for backend)
- (Optional) Docker for containerized development

### Backend

1. Navigate to the backend directory:
    ```sh
    cd backend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. (Optional) Set up environment variables in `.env`.

### Frontend

1. Navigate to the frontend directory:
    ```sh
    cd frontend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```

---

## Running the Application

### Backend

- **Development mode:**
    ```sh
    npm run start:dev
    ```
- **Production mode:**
    ```sh
    npm run start:prod
    ```

### Frontend

- **Development server:**
    ```sh
    ng serve
    ```
    Visit [http://localhost:4200](http://localhost:4200) in your browser.

---

## Implemented Features

### Backend (NestJS)

- RESTful API structure using controllers, services, and modules
- Prisma ORM integration for database access ([prisma/schema.prisma](backend/prisma/schema.prisma))
- Environment-based configuration
- Unit and e2e testing setup
- File upload support (see `uploads/` directory)
- Modular code organization for scalability

### Frontend (Angular)

- Angular CLI project structure
- Component-based UI architecture
- Code scaffolding via Angular CLI
- Unit and e2e testing setup
- Hot-reloading development server

---


## Deployment

- See [NestJS deployment documentation](https://docs.nestjs.com/deployment) for backend deployment strategies.
- For deploying on AWS, consider using [NestJS Mau](https://mau.nestjs.com).

---

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Angular CLI Overview](https://angular.dev/tools/cli)

---

## License

This project is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
