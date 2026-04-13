# ProjectHub — Project Management Tool

A full-stack project management app built with Django and React. I built this project to practice full-stack development and learn how REST APIs work with a React frontend.

---

## Features

- User registration and login
- Create and manage projects
- Kanban board with To Do / In Progress / Done columns
- Add tasks with priority and due date
- Comment on tasks
- Add team members to projects
- Search projects
- Progress tracking per project

---

## Tech Stack

- **Frontend:** React, React Router, Vite
- **Backend:** Python, Django, Django REST Framework
- **Database:** SQLite3
- **Auth:** Token-based authentication

---

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## What I Learned

- How to build REST APIs with Django REST Framework
- Connecting a React frontend to a Django backend
- Token authentication flow
- Managing state in React with hooks

---

## Future Plans

- Add drag and drop for tasks
- Real-time updates with WebSockets
- Deploy online

---

## Author

**Mukesh** — [MukeshDevX](https://github.com/MukeshDevX)

© 2025 Mukesh. All rights reserved.
