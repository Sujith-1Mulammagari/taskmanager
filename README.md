<div align="center">

# 🚀 Task Manager Application

### Production Ready Full Stack Task Management System

Built with **Spring Boot • React • MySQL • Docker • AWS EC2**

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-brightgreen?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue?style=for-the-badge&logo=mysql)
![Docker](https://img.shields.io/badge/Docker-Container-blue?style=for-the-badge&logo=docker)
![AWS](https://img.shields.io/badge/AWS-EC2-orange?style=for-the-badge&logo=amazonaws)

</div>

---

# 📌 Overview

Task Manager Application is a full-stack web application that helps users efficiently manage daily tasks.

The application provides a modern React frontend and a RESTful Spring Boot backend connected to a MySQL database.

The entire application is containerized using Docker and deployed on AWS EC2.

---

# 🌍 Live Demo

**Application**

http://16.112.184.6/

---

# ✨ Features

- ✅ Create Tasks
- ✅ View Tasks
- ✅ Update Tasks
- ✅ Delete Tasks
- ✅ Task Priority
- ✅ Task Status
- ✅ Due Date Management
- ✅ Responsive UI
- ✅ REST APIs
- ✅ Dockerized Deployment
- ✅ AWS EC2 Hosting

---

# 🛠 Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React.js |
| Backend | Spring Boot |
| Language | Java |
| Database | MySQL |
| ORM | Spring Data JPA |
| Build Tool | Maven |
| Web Server | Nginx |
| Container | Docker |
| Deployment | AWS EC2 |
| Version Control | Git & GitHub |

---

# 📂 Project Structure

```text
taskmanager
│
├── backend
│
│   ├── controller
│   ├── service
│   ├── repository
│   ├── model
│   ├── dto
│   ├── exception
│   └── config
│
├── frontend
│
│   ├── components
│   ├── context
│   ├── services
│   └── public
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

# 🏗 System Architecture

```text
            User
              │
              ▼
      React Frontend
              │
              ▼
      Spring Boot REST API
              │
              ▼
      Spring Data JPA
              │
              ▼
          MySQL Database
```

---

# 🐳 Docker Architecture

```text
              Docker Compose

        ┌──────────────┐
        │    React     │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │ Spring Boot  │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │    MySQL     │
        └──────────────┘
```

---

# ☁ AWS Deployment

```text
Internet
     │
     ▼
 AWS EC2 Instance
     │
     ├── React
     ├── Spring Boot
     ├── MySQL
     └── Docker Compose
```

---

# 📸 Screenshots

## Dashboard

![Dashboard](screenshots/home.png)

---

## Add Task

![Add Task](screenshots/add-task.png)

---

## Update Task

![Update Task](screenshots/update-task.png)

---

## Delete Task

![Delete Task](screenshots/delete-task.png)

---

# REST APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/tasks | Get All Tasks |
| GET | /api/tasks/{id} | Get Task |
| POST | /api/tasks | Create Task |
| PUT | /api/tasks/{id} | Update Task |
| DELETE | /api/tasks/{id} | Delete Task |

---

# ⚙ Run Locally

## Backend

```bash
cd backend

mvn spring-boot:run
```

---

## Frontend

```bash
cd frontend

npm install

npm start
```

---

# Docker

```bash
docker-compose up --build
```

---

# Database

MySQL

Table

Task

| Column |
|---------|
| id |
| title |
| description |
| priority |
| status |
| dueDate |

---

# Learning Outcomes

During this project I learned

- Spring Boot REST APIs

- React Components

- React Context API

- CRUD Operations

- Docker

- Docker Compose

- AWS EC2

- Git & GitHub

- MySQL

- Spring Data JPA

- REST API Integration

- Deployment

---

# Future Enhancements

- JWT Authentication

- User Login

- User Registration

- Email Notification

- Search

- Pagination

- Dark Mode

- Jenkins CI/CD

- Kubernetes

---

# Author

## Sujith Kumar Reddy Mulammagari

GitHub

https://github.com/Sujith-1Mulammagari

LinkedIn

https://www.linkedin.com/in/sujith-kumar-reddy-mulammagari/

Email

mskr2806@gmail.com

---

⭐ If you found this project useful, consider giving it a star.
