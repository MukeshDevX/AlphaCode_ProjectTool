# 📋 ProjectHub — Project Management Tool

A full-stack project management application built with Django REST Framework and React. Designed to help teams create projects, manage tasks, and collaborate efficiently.

---

## 🚀 Live Demo

> Run locally — setup instructions below.

---

## ✨ Features

- **User Authentication** — Register, login, and logout with token-based auth
- **Project Management** — Create, edit, and delete projects with status tracking
- **Kanban Board** — Visual task board with To Do / In Progress / Done columns
- **Task Management** — Add tasks with priority levels, due dates, and descriptions
- **Team Collaboration** — Add members to projects and assign tasks
- **Comments** — Comment on tasks and delete your own comments
- **Progress Tracking** — Live progress bar per project
- **Search** — Real-time project search by name or description
- **Admin Panel** — Full data management via Django admin

---

## 🛠️ Tech Stack

**Frontend**
- React 18
- React Router DOM
- Vite
- CSS3 (custom dark theme)

**Backend**
- Python 3
- Django 4.2
- Django REST Framework
- SQLite3

---

## 📁 Project Structure

```
projecthub/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── core/              # settings, urls, wsgi
│   ├── accounts/          # user auth (register, login, logout)
│   └── projects/          # projects, tasks, comments
│
└── frontend/
    ├── index.html
    ├── package.json
    └── src/
        ├── api.js         # all API calls
        ├── App.jsx
        ├── pages/         # Login, Register, Dashboard, ProjectDetail
        └── components/    # Navbar, Modal, ProjectCard, TaskCard, TaskModal
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm

---

### Backend Setup

```bash
# Go to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations accounts
python manage.py makemigrations projects
python manage.py migrate

# (Optional) Create admin user
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

---

### Frontend Setup

```bash
# Go to frontend folder
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login |
| POST | `/api/auth/logout/` | Logout |
| GET/POST | `/api/projects/` | List / Create projects |
| GET/PUT/DELETE | `/api/projects/:id/` | Project detail |
| POST | `/api/projects/:id/add-member/` | Add team member |
| GET/POST | `/api/projects/:id/tasks/` | List / Create tasks |
| GET/PUT/DELETE | `/api/projects/:id/tasks/:id/` | Task detail |
| POST | `/api/projects/:id/tasks/:id/comments/` | Add comment |
| DELETE | `/api/projects/:id/tasks/:id/comments/:id/` | Delete comment |

---

## 📸 Screenshots

> Coming soon

---

## 🔮 Future Improvements

- Real-time notifications using WebSockets
- Drag and drop tasks between columns
- File attachments on tasks
- Email notifications for due dates
- Deploy to cloud (Render / Vercel)

---

## 👤 Author

**Taki**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [your-linkedin](https://linkedin.com/in/your-linkedin)

---

## 📄 License

© 2025 Taki. All rights reserved.
