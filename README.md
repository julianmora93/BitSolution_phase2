# BitSolution Phase 2 Project

## Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Endpoints](#endpoints)
- [Key Components](#key-components)
  - [Plugins](#plugins)
  - [Services](#services)
  - [Database](#database)
- [Problem Solving](#problem-solving)
- [Deployment](#deployment)
- [Getting Started](#getting-started)

## Overview

The BitSolution Phase 2 project is designed to provide a robust backend solution using Fastify, Prisma, and BullMQ. It integrates various services and plugins to handle tasks such as user management, email notifications, and scheduled jobs.

## Project Structure

- **src/plugins**: Contains Fastify plugins for integrating various services like Redis, Prisma, and Cron jobs.
- **src/repositories**: Houses database interaction logic using Prisma for managing user data.
- **src/services**: Includes business logic services such as enqueueing tasks and sending notifications.
- **src/interfaces**: Defines TypeScript interfaces for data structures used across the project.
- **src/schemas**: Contains JSON schemas for request and response validation.
- **test**: Contains test cases to ensure the functionality of the application.

## Endpoints

- **Notifications**
    - **POST /posts/published-notification**: Simulate publishing posts and enqueue notifications for users.

- **QueueManager**
    - **GET /queue-manager**: Retrieve all queued messages.
    - **POST /queue-manager-clear**: Remove all messages from the postNotification queue.

- **User**
    - **GET /users**: 
        Retrieves the list of users stored in the database.
        The following parameters can be used to apply filters.
        - **name**: Filter messages by name. **Not required**.
        - **username**: Filter messages by name. **Not required**.
        - **email**: Filter messages by name. **Not required**.
        - **phone**: Filter messages by name. **Not required**.
        - **website**: Filter messages by name. **Not required**.

    - **POST /users/load**: Loads users from an external API and saves them to the database.


## Key Components

### Plugins

- **[Redis Plugin](src/plugins/01.redis.ts)**: Manages caching and session storage using Redis. Utiliza `Keyv` y `KeyvRedis` para manejar la conexión y almacenamiento en Redis.

- **[BullMQ Plugin](src/plugins/02.bullmq.ts)**: Configura y gestiona las colas de tareas utilizando BullMQ. Permite la ejecución de trabajos en segundo plano con opciones de reintento y eliminación automática de trabajos completados o fallidos.

- **[Prisma Plugin](src/plugins/03.prisma.ts)**: Maneja las conexiones y operaciones de base de datos utilizando Prisma ORM. Configura el cliente de Prisma para conectarse a la base de datos PostgreSQL.

- **[Axios Plugin](src/plugins/04.axios.ts)**: Proporciona una instancia de Axios para realizar solicitudes HTTP y maneja errores específicos de Axios.

- **[Error Handler Plugin](src/plugins/05.error-handler.ts)**: Implementa un manejador de errores personalizado que gestiona errores comunes de Prisma y Axios, proporcionando mensajes de error claros y códigos de estado HTTP.

- **[Swagger Plugin](src/plugins/06.swagger.ts)**: Integra Swagger para la documentación de la API, permitiendo la visualización y prueba de los endpoints a través de una interfaz gráfica.

- **[Mailer Plugin](src/plugins/07.mailer.ts)**: Configura un servicio de correo utilizando `fastify-mailer` para enviar notificaciones por email. Utiliza MailHog como servidor SMTP en el entorno de desarrollo.

- **[Cron Plugin](src/plugins/08.cron.ts)**: Programa y ejecuta tareas periódicas utilizando `fastify-cron`. Configura trabajos cron para ejecutar tareas a intervalos regulares, como el procesamiento de notificaciones.

### Services

- **[Enqueue Service](src/services/enqueue.ts)**: Manages task queues using BullMQ, allowing tasks to be processed asynchronously.
- **[Worker Service](src/services/worker.ts)**: Processes queued tasks, such as sending email notifications.

### Database

- **Prisma**: Used for database schema management and query execution. The schema is defined in `prisma/schema.prisma`.

## Problem Solving

The project addresses several key challenges:

1. **Scalability**: By using BullMQ for task queuing, the system can handle a large number of tasks without blocking the main application flow.
2. **Modularity**: The use of Fastify plugins allows for easy integration and management of various services.
3. **Maintainability**: TypeScript and Prisma provide strong typing and schema management, reducing runtime errors and improving code quality.

## Deployment

The project is containerized using Docker, with configurations provided in `Dockerfile` and `docker-compose.yml`. Kubernetes deployment configurations are available in `kubernetes/deployment.yaml`.

The [docker-compose.yml](docker-compose.yml) file is provided to facilitate the setup of the `PostgreSQL` database, `MailHog` service, and `Redis` in a local development environment.

**Contents of `docker-compose.yml`:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres
    restart: always
    container_name: db-phase-2
    environment:
      POSTGRES_USER: bitsolution
      POSTGRES_PASSWORD: bitsolution
      POSTGRES_DB: db_test
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:alpine
    restart: always
    container_name: redis-phase-2
    ports:
      - "6379:6379"

  mailhog:
    image: mailhog/mailhog
    restart: always
    container_name: mailhog-phase-2
    ports:
      - "8025:8025"
      - "1025:1025"

volumes:
  postgres_data:
```

To start the PostgreSQL database with Docker Compose, run:
```bash
docker-compose up -d
```

To stop the PostgreSQL database with Docker Compose, run:
```bash
docker-compose down
```

To rebuild in case of changes to the DockerFile or dependencies, you can run:
```bash
docker-compose up -d --build
```

To see the running containers:
```bash
docker ps
```

Access the PostgreSQL container:
```bash
docker exec -it db-bitsolution bash
```

## Getting Started

1. **Install Dependencies**: Run `npm install` to install all necessary packages.
2. **Build the Project**: Use `npm run build` to compile the TypeScript code.
3. **Run the Application**: Start the server with `npm start`.
4. **Run the Application in Dev**: Execute dev mode using `npm run dev`.