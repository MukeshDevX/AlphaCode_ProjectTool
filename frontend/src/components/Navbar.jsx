import { Link } from 'react-router-dom'

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">📋 ProjectHub</Link>
      <div className="nav-right">
        <span className="nav-user">👤 {user?.username}</span>
        <button className="btn-logout" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  )
}

export default Navbar
