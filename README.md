# 🛒 CraveCart – Full Stack Retail Ordering System

CraveCart is a full-stack retail ordering web application that allows customers to browse menu items and place orders securely using JWT-based authentication and role-based authorization.

This project demonstrates secure backend development using Spring Boot and modern frontend development using React.

---

## 🚀 Tech Stack

### 🔹 Backend
- Java 21
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA (Hibernate)
- MySQL
- Maven

### 🔹 Frontend
- React (Vite)
- Axios
- JavaScript (ES6+)
- CSS

---

## 🔐 Core Features

- User Registration & Login
- JWT-Based Stateless Authentication
- Role-Based Authorization (Admin / Customer)
- Secure REST APIs
- Add & Manage Menu Items (Admin)
- Place Orders (Customer)
- Password Encryption using BCrypt
- Global Exception Handling
- CORS Configuration
- MVC Architecture

---

## 🔄 Authentication Flow (Technical Overview)

1. User registers or logs in.
2. Backend validates credentials.
3. JWT token is generated and returned.
4. Frontend stores token (localStorage).
5. Token is sent in every request header:- Authorization: Bearer <token>
6. JwtAuthenticationFilter validates the token.
7. User is authenticated without using sessions (Stateless).

---

## 🏗 Project Structure
CraveCart
├── retail-ordering-backend
│ ├── controller
│ ├── service
│ ├── repository
│ ├── entity
│ ├── security
│ ├── config
│ └── dto
│
├── retail-ordering-frontend
│ ├── src
│ ├── components
│ ├── services
│ └── pages


---

## 🛠 API Endpoints

### 🔐 Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### 🛍 Menu
- `GET /api/menu`
- `POST /api/menu` (Admin Only)

### 📦 Orders
- `POST /api/orders` (Authenticated Users)

---

## ⚙️ How To Run Locally

### ▶ Backend Setup
cd retail-ordering-backend

mvn spring-boot:run

Runs on:

http://localhost:8080

### ▶ Frontend Setup
cd retail-ordering-frontend

npm install

npm run dev

Runs on:

http://localhost:5173

---

## 🧠 Technical Concepts Implemented

- RESTful API Design
- Stateless Authentication
- JWT Token Generation & Validation
- Spring Security Filter Chain
- Role-Based Access Control (RBAC)
- Exception Handling using @ControllerAdvice
- Data Validation using Jakarta Validation
- JPA & Hibernate ORM
- Layered Architecture (Controller → Service → Repository)

---

## 📌 Future Enhancements

- Add Payment Gateway Integration
- Add Order History Page
- Admin Dashboard with Analytics
- Docker Deployment
- Cloud Deployment (Render / AWS)

---

## 👩‍💻 Author

Anchal Shukla

Computer Science Engineering Student

⭐ If you found this project useful, feel free to star the repository!