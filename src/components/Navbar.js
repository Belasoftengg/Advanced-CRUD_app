import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">MERN</Link>
        <div className="navbar-nav ms-auto">
          {user ? (
            <>
              <span className="navbar-text me-3">Hi, {user.name}</span>
              <button className="btn btn-outline-light btn-sm" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
