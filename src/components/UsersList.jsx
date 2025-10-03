import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchUsers, 
  deleteUser, 
  selectSortedUsers, 
  selectLoading, 
  selectError,
  selectSortBy,
  selectSortOrder,
  setSortBy,
  toggleSortOrder
} from '../store/usersSlice'
import './UsersList.css'

const UsersList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  // Redux selectors
  const users = useSelector(selectSortedUsers)
  const loading = useSelector(selectLoading)
  const error = useSelector(selectError)
  const sortBy = useSelector(selectSortBy)
  const sortOrder = useSelector(selectSortOrder)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`)
  }

  const handleDeleteUser = (e, userId) => {
    e.stopPropagation() // Prevent navigation when clicking delete
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId))
    }
  }

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      dispatch(toggleSortOrder())
    } else {
      dispatch(setSortBy(newSortBy))
    }
  }

  const handleAddUser = () => {
    navigate('/add-user')
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
      <div className="users-header">
        <div className="header-content">
          <h2 className="users-title">Users List</h2>
          <p className="users-subtitle">
            Manage users - {users.length} users total
          </p>
        </div>
        <button onClick={handleAddUser} className="add-user-button">
          + Add User
        </button>
      </div>
      
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

      {/* Sorting Controls */}
      <div className="sorting-controls">
        <span className="sort-label">Sort by:</span>
        <button 
          className={`sort-button ${sortBy === 'name' ? 'active' : ''}`}
          onClick={() => handleSortChange('name')}
        >
          Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button 
          className={`sort-button ${sortBy === 'email' ? 'active' : ''}`}
          onClick={() => handleSortChange('email')}
        >
          Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button 
          className={`sort-button ${sortBy === 'company' ? 'active' : ''}`}
          onClick={() => handleSortChange('company')}
        >
          Company {sortBy === 'company' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
      </div>
      
      <div className="users-grid">
        {filteredUsers.map(user => (
          <div 
            key={user.id} 
            className="user-card clickable"
            onClick={() => handleUserClick(user.id)}
          >
            <button 
              className="delete-button"
              onClick={(e) => handleDeleteUser(e, user.id)}
              title="Delete user"
            >
              ✕
            </button>
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
                    onClick={(e) => e.stopPropagation()}
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

