import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProjectDetail from './pages/ProjectDetail'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser]   = useState(JSON.parse(localStorage.getItem('user') || 'null'))

  const handleLogin = (tokenVal, userData) => {
    localStorage.setItem('token', tokenVal)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(tokenVal)
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const isLoggedIn = !!token

  return (
    <BrowserRouter>
      {isLoggedIn && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route path="/login"      element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register"   element={isLoggedIn ? <Navigate to="/" /> : <Register onLogin={handleLogin} />} />
        <Route path="/"           element={isLoggedIn ? <Dashboard token={token} user={user} /> : <Navigate to="/login" />} />
        <Route path="/project/:id" element={isLoggedIn ? <ProjectDetail token={token} user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
