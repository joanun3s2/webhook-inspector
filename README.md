# Webhook Inspector Mono Repo

This mono repo project provides a solution for intercepting webhooks and generating a TypeScript handler with AI.

## Purpose

The purpose of this project is to provide a simple and easy-to-use solution for intercepting webhooks and generating a TypeScript handler with AI. The solution is divided into three main projects:

- **API Project**: This project provides an API for capturing webhooks and generating a TypeScript handler with AI. It uses Fastify as the web framework and PostgreSQL as the database.
- **Web Project**: This project provides a web interface for capturing and check details of webhooks and generating a TypeScript handler with AI. It uses React as the frontend framework and Tailwind CSS as the CSS framework.
- **Note**: It uses the AI is succinct and provides just enough information to be useful: it will generally only generate a single function or a couple lines of code to fulfill the instruction. If the AI does not know how to follow the instruction, the ASSISTANT should not reply at all.

The the API project is structured as follows:

- The API project is divided into routes, services, and schema.
- The routes define the API endpoints and the services provide the business logic for the API endpoints.
- The schema defines the database schema and the database models.

The web project is structured as follows:

- The web project is divided into components, pages, and http.
- The components define the reusable UI components for the web project.
- The pages define the web pages for the web project.
- The http defines what is needed to handle connection through API client for the web project.

## Frameworks and Libraries Used

The following frameworks and libraries are used in this project:

- **Fastify**: A web framework for Node.js.
- **PostgreSQL**: A relational database management system.
- **React**: A frontend framework for building user interfaces.
- **Tailwind CSS**: A CSS framework for building user interfaces.
- **TypeScript**: A programming language for building web applications.
- **Drizzle**: A database migration tool for Node.js.
- **TanStack**: A router for Node.js.
- **TanStack Query**: Asynchronous state management, server-state utilities and data fetching.
- **Zod**: A validation library for Node.js.
- **Lucide**: A set of React components for building user interfaces.

## Setup and Run

To setup and run this project, follow these steps:

1. Clone the repository to your local machine.
2. Install the dependencies for each project by running `pnpm install`.
3. Start the database by running the DB container `docker compose up -d`.
4. Start the API project by running `pnpm run dev`.
5. Start the web project by running `pnpm run dev`.
6. Open a web browser and navigate to `http://localhost:5173` to use the web project or access the API by `http://localhost:3333`.

Note: The API project is required to run the web project, so make sure to start the API project before starting the web project.
