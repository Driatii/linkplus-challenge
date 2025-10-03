import React from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import UsersList from './components/UsersList'
import UserDetails from './components/UserDetails'
import AddUser from './components/AddUser'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="container">
            <h1 className="app-title">LinkPlus Challenge</h1>
            <nav className="app-nav">
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                Users
              </NavLink>
              {/* Future routes will be added here */}
            </nav>
          </div>
        </header>

        <main className="app-main">
          <div className="container">
            <Routes>
              <Route path="/" element={<UsersList />} />
              <Route path="/user/:userId" element={<UserDetails />} />
              <Route path="/add-user" element={<AddUser />} />
              {/* Future routes will be added here */}
            </Routes>
          </div>
        </main>

        <footer className="app-footer">
          <div className="container">
            <p>Link Plus React Challenge by Driat Hasani</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App

