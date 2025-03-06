```markdown
# Real-Time Notification System

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation & Setup](#installation--setup)
4. [Running the Application](#running-the-application)
5. [Usage](#usage)
6. [System Design](#system-design)
7. [Tech Stack and Justification](#tech-stack-and-justification)
8. [Project Structure](#project-structure)
9. [Troubleshooting](#troubleshooting)
10. [Conclusion](#conclusion)

---

## 1. Introduction

This project is a real-time notification system designed to deliver user-specific notifications instantly with minimal latency. The system is built to be scalable and fault-tolerant, ensuring that it can handle high traffic. The architecture uses Node.js, Redis, PostgreSQL, and Nginx—all containerized with Docker Compose for a quick and cost-free deployment in a local development environment.

---

## 2. Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## 3. Installation & Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/realtime-notifications.git
   cd realtime-notifications
   ```

2. **Review the System Design:**

   At the root of the project, you will find a file named `systemdesign.lua`. This file contains the complete system design, including a diagram and explanations of how each component interacts. It details the choices made based on the key requirements.

3. **(Optional) Configure Environment Variables:**

   The default configuration is set in the `docker-compose.yml` file. If needed, modify the environment variables (e.g., `POSTGRES_USER`, `POSTGRES_PASSWORD`, etc.) directly in the file.

4. **Database Setup:**

   A SQL script named `setup.sql` is provided at the root of the project. This script creates the necessary tables in the PostgreSQL database.


   **Manual Copy and Execution**

   copy the file manually, use the following commands:

   1. **Copy the `setup.sql` file into the PostgreSQL container:**

      ```bash
      docker cp setup.sql <container_name_or_id>:/setup.sql
      ```
      
      *Replace `<container_name_or_id>` with the actual name or ID of your PostgreSQL container (you can obtain it with `docker ps`).*

   2. **Execute the SQL script inside the container:**

      ```bash
      docker-compose exec postgres psql -U youruser -d notifications_db -f /setup.sql
      ```

---

## 4. Running the Application

To build and start the application using Docker Compose (with scaling for Node.js instances), run:

```bash
docker-compose up --build --scale node=2
```

This command will build the Docker images and start the following services:
- **Nginx** as a load balancer (listening on port 80)
- **Node.js** (API REST + Socket.IO) scaled to 2 instances
- **Redis** (for Pub/Sub)
- **PostgreSQL** (for data persistence)

Access the application via `http://localhost` — Nginx will route incoming requests to the Node.js services.

---

## 5. Usage

### Accessing the Client

A simple client for testing real-time notifications is provided in the `client` directory. Open the file `client/index.html` in your browser (ensure it’s served over HTTP, not via the file system) to test the real-time functionality.

### Sending a Notification

You can send a notification using an HTTP POST request to the `/notify` endpoint.

#### Using Postman:
- **Method:** POST  
- **URL:** `http://localhost/notify`  
- **Headers:** `Content-Type: application/json`  
- **Body (raw JSON):**
  ```json
  {
      "userId": "user123",
      "message": "This is a test notification."
  }
  ```

#### Using curl:
```bash
curl -X POST http://localhost/notify \
     -H "Content-Type: application/json" \
     -d '{"userId": "user123", "message": "This is a test notification."}'
```

When a notification is sent, it will be recorded in PostgreSQL and broadcast in real-time to the appropriate client (registered via Socket.IO).

---

## 6. System Design

The complete system design is documented in the `systemdesign.lua` file at the project root. This document details:
- **Nginx Load Balancer:** Distributes incoming HTTP and WebSocket traffic to multiple Node.js instances.
- **Node.js (API + Socket.IO):** Handles REST API requests and real-time communication.
- **Redis (Pub/Sub):** Synchronizes messages between multiple Node.js instances.
- **PostgreSQL:** Stores notification history and persists user data.
- **Docker Compose:** Orchestrates all services in a containerized environment, ensuring scalability and ease of deployment.

---

## 7. Tech Stack and Justification

### Node.js, Express, and Socket.IO
- **Real-Time Notifications & Low Latency:**  
  Node.js is built for asynchronous operations, making it ideal for real-time applications. Socket.IO simplifies WebSocket communication for instant message delivery.
- **User-Specific:**  
  With Socket.IO, clients can join specific rooms (based on user IDs) ensuring that notifications are delivered only to intended recipients.
- **Scalability:**  
  Stateless Node.js instances are easily scalable horizontally using Docker Compose.

### Redis Pub/Sub
- **Low Latency & Real-Time Communication:**  
  Redis, with its in-memory storage and Pub/Sub capabilities, provides extremely fast messaging between services.
- **Fault-Tolerance:**  
  Redis decouples the messaging layer from application logic, ensuring notifications are still distributed even if one Node.js instance fails.

### PostgreSQL
- **Data Persistence:**  
  PostgreSQL reliably stores notification history, ensuring data is not lost and can be audited or retrieved later.
- **Scalability:**  
  PostgreSQL is robust, supports complex queries, and can be optimized for performance as needed.

### Nginx
- **Load Balancing:**  
  Nginx efficiently distributes incoming traffic among Node.js instances. It supports both HTTP and WebSocket protocols, ensuring smooth real-time communication.
- **Low Latency & Fault-Tolerance:**  
  Nginx’s lightweight architecture helps minimize latency and provides resilience by routing traffic away from failed instances.

### Docker Compose
- **Ease of Deployment:**  
  Docker Compose orchestrates all services in isolated containers, simplifying setup and ensuring a consistent environment.
- **Scalability & Isolation:**  
  It allows for quick scaling (e.g., `docker-compose up --scale node=2`) and helps avoid dependency conflicts.

---

## 8. Project Structure

```
/realtime-notifications
├── client
│   └── index.html            # Client for testing real-time notifications
├── config
│   ├── db.js                 # PostgreSQL configuration
│   ├── redis.js              # Redis publisher configuration
│   └── redisSubscriber.js    # Redis subscriber configuration
├── controllers
│   └── notificationController.js  # Notification handling logic
├── models
│   └── notificationModel.js  # Database model for notifications
├── routes
│   └── notifications.js      # API route for notifications
├── sockets
│   └── socketHandler.js      # Socket.IO handling and subscription logic
├── systemdesign.lua          # System Design Document (contains architecture details)
├── setup.sql                 # SQL script to initialize the PostgreSQL database
├── Dockerfile                # Dockerfile for building the Node.js image
├── docker-compose.yml        # Docker Compose configuration file
├── package.json              # Node.js dependencies and scripts
└── README.md                 # This file
```

---

## 9. Troubleshooting

- **WebSocket Connection Issues:**  
  Ensure that your client is served over HTTP (e.g., via Express or Nginx) and not via the `file://` protocol. Check your browser's console for errors.
- **Port Conflicts:**  
  Verify that ports 80 (Nginx), 6379 (Redis), and 5432 (PostgreSQL) are not already in use on your host.
- **Service Logs:**  
  Use `docker-compose logs` to view logs for each service if any issues arise.
- **Nginx Configuration:**  
  Ensure that the Nginx configuration includes the necessary directives for WebSocket upgrade (e.g., `proxy_set_header Upgrade $http_upgrade;`).

---

## 10. Conclusion

This real-time notification system is designed to meet the key requirements of delivering instant, user-specific notifications in a scalable and fault-tolerant manner with low latency. The chosen tech stack—Node.js with Socket.IO, Redis, PostgreSQL, Nginx, and Docker Compose—supports these goals and provides a robust, containerized solution suitable for a classroom project.

For further details on the architecture and design decisions, please refer to the `systemdesign.lua` file at the project root.

Thank you for reviewing this project!
```