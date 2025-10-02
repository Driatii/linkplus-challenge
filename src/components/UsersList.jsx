import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './UsersList.css'

const UsersList = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const userData = await response.json()
        setUsers(userData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`)
  }

  if (loading) {
    return (
      <div className="users-container">
        <h2 className="users-title">Users List</h2>
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="users-container">
        <h2 className="users-title">Users List</h2>
        <div className="error">
          <p>Error fetching users: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="users-container">
      <h2 className="users-title">Users List</h2>
      <p className="users-subtitle">
        Fetched from JSONPlaceholder API - {users.length} users found
      </p>
      
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="search-icon">🔍</div>
        </div>
        {searchTerm && (
          <p className="search-results">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>
      
      <div className="users-grid">
        {filteredUsers.map(user => (
          <div 
            key={user.id} 
            className="user-card clickable"
            onClick={() => handleUserClick(user.id)}
          >
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <h3 className="user-name">{user.name}</h3>
              <p className="user-email">
                <span className="label">Email:</span> {user.email}
              </p>
              <p className="user-company">
                <span className="label">Company:</span> {user.company.name}
              </p>
              <div className="user-details">
                <p className="user-phone">
                  <span className="label">Phone:</span> {user.phone}
                </p>
                <p className="user-website">
                  <span className="label">Website:</span> 
                  <a 
                    href={`https://${user.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="website-link"
                  >
                    {user.website}
                  </a>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UsersList

