# 🚀 Full-Stack Portfolio Project

A modern full-stack web application built with **Next.js 15**, **Hero UI**, **TanStack Query**, **Zustand**, **Tailwind CSS**, and a **Django REST Framework** backend powered by **JWT authentication** and **MySQL**.  
This project serves as a personal showcase of my skills in building performant, scalable, and developer-friendly web apps using the latest tools across the stack.

---

## 📌 Features

### ✅ Frontend (Next.js 15)
- Built with **Next.js 15 App Router** and **React Server Components**
- Responsive UI with **Tailwind CSS** and **Hero UI**
- Client-server data sync using **TanStack Query**
- Global state management with **Zustand**
- Secure token-based authentication via **JWT**
- Modular, component-driven architecture

### 🔗 Backend (Django REST Framework)
- RESTful API built with **DRF**
- JWT authentication using **djangorestframework-simplejwt**
- Clean separation of concerns with **serializers**, **viewsets**, and **permissions**
- MySQL as the primary database
- CORS and secure headers configured for production use

---

## 🧰 Tech Stack

| Layer        | Technology                              |
|--------------|------------------------------------------|
| Frontend     | Next.js 15, React, Hero UI, Tailwind CSS |
| Data Fetching| TanStack Query                          |
| State Mgmt   | Zustand                                  |
| Backend      | Django, Django REST Framework            |
| Auth         | JWT (SimpleJWT)                          |
| Database     | MySQL                                    |
| Deployment   | Vercel (Frontend), Railway/Render (Backend) |

---

## ⚙️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/syahrilhanla/fullstack-commerce.git
cd fullstack-commerce
```

### 1. Setup Environment Variables in Root Dir
```bash
XENDIT_API_KEY=
XENDIT_PUBLIC_API_KEY=

# Database Configuration
DB_NAME=
DB_USERNAME=
DB_PASSWORD=
DB_HOST=
PORT=
```

### 3. Backend Setup (Django + MySQL)
```bash
cd backend
python -m venv env
source env/bin/activate
pip install -r requirements.txt

# Configure MySQL settings in backend/settings.py

python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### 4. Frontend Setup (Next.js 15)
```bash
cd frontend
npm install
npm run dev
```
