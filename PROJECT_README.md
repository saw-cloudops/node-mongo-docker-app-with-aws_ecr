# 🐳 Node.js User Profile App — Docker + MongoDB + AWS ECR

![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![AWS ECR](https://img.shields.io/badge/AWS_ECR-232F3E?style=flat&logo=amazon-aws&logoColor=white)

## 📌 Project Overview

A full-stack **User Profile Application** demonstrating containerized application deployment using Docker and AWS ECR (Elastic Container Registry).

**Architecture:**
```
Browser (index.html)
      ↓
Node.js Backend (Express) — Port 3000
      ↓
MongoDB Database — Port 27017
      ↓
Mongo-Express UI — Port 8080
```

**Tech Stack:**
- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js + Express
- Database: MongoDB 5.0
- Containerization: Docker + Docker Compose
- Registry: AWS ECR (ap-southeast-1)

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────┐
│           Docker Network                │
│                                         │
│  ┌──────────────┐   ┌────────────────┐  │
│  │   my-app     │   │   mongodb      │  │
│  │  (Node.js)   │──▶│  (Port 27017)  │  │
│  │  Port 3000   │   └────────────────┘  │
│  └──────────────┘           │           │
│                             ▼           │
│                   ┌────────────────┐    │
│                   │ mongo-express  │    │
│                   │  (Port 8080)   │    │
│                   └────────────────┘    │
└─────────────────────────────────────────┘
         ↑
    AWS ECR Image
(ap-southeast-1 region)
```

---

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose installed
- AWS CLI configured (for ECR)
- Node.js 20+ (for local development)

### Environment Setup

**Step 1:** Clone the repository
```bash
git clone https://github.com/saw-cloudops/node-mongo-docker-app
cd node-mongo-docker-app
```

**Step 2:** Create `.env` file from template
```bash
cp .env.example .env
```

**Step 3:** Fill in your credentials in `.env`
```
MONGO_URL=mongodb://admin:yourpassword@mongodb:27017
MONGO_USERNAME=admin
MONGO_PASSWORD=yourpassword
```

---

## 🐳 Run with Docker Compose (Recommended)

```bash
# Start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop all services
docker-compose down
```

**Access the apps:**
| Service | URL |
|---------|-----|
| Node.js App | http://localhost:3000 |
| Mongo Express UI | http://localhost:8080 |

---

## 🔧 Run with Docker (Manual)

**Step 1:** Create Docker network
```bash
docker network create mongo-network
```

**Step 2:** Start MongoDB
```bash
docker run -d \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=${MONGO_USERNAME} \
  -e MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD} \
  --name mongodb \
  --net mongo-network \
  mongo:5.0
```

**Step 3:** Start Mongo Express
```bash
docker run -d \
  -p 8080:8081 \
  -e ME_CONFIG_MONGODB_ADMINUSERNAME=${MONGO_USERNAME} \
  -e ME_CONFIG_MONGODB_ADMINPASSWORD=${MONGO_PASSWORD} \
  -e ME_CONFIG_MONGODB_SERVER=mongodb \
  --net mongo-network \
  --name mongo-express \
  mongo-express
```

**Step 4:** Open Mongo Express → http://localhost:8081

**Step 5:** Create database `user-account` and collection `users`

**Step 6:** Start Node.js app
```bash
npm install
node server.js
```

**Step 7:** Access app → http://localhost:3000

---

## 🏗️ Build Docker Image

```bash
# Build image locally
docker build -t node-mongo-app:1.0 .

# Tag for AWS ECR
docker tag node-mongo-app:1.0 \
  <your-account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/<repo-name>:1.0
```

---

## ☁️ Push to AWS ECR

```bash
# Authenticate to ECR
aws ecr get-login-password --region ap-southeast-1 | \
  docker login --username AWS \
  --password-stdin <your-account-id>.dkr.ecr.ap-southeast-1.amazonaws.com

# Push image
docker push <your-account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/<repo-name>:1.0
```

---

## 📁 Project Structure

```
node-mongo-docker-app/
├── index.html          # Frontend UI
├── server.js           # Node.js Express backend
├── package.json        # Node.js dependencies
├── Dockerfile          # Container build instructions
├── docker-compose.yml  # Multi-container orchestration
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

---

## 🔐 Security Notes

- Never commit `.env` files to Git
- Credentials are passed via environment variables at runtime
- `.env` is listed in `.gitignore`
- Use AWS Secrets Manager for production deployments

---

## 💡 What I Learned

- Docker containerization and image building
- Multi-container orchestration with Docker Compose
- MongoDB + Node.js integration in containers
- AWS ECR image registry workflow
- Environment variable management for security
- Docker networking between containers

---

## 🔗 Related Projects

- [3-Tier Leave Management System on AWS](https://github.com/saw-cloudops)
- [Netflix Clone — DevSecOps on EKS](https://github.com/saw-cloudops)
- [Serverless Student Management System](https://github.com/saw-cloudops)

---

*Built by [Aung Saw Hein](https://linkedin.com/in/aung-saw-hein-47a616225) | Aspiring Cloud DevOps Engineer*
