import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUsers } from '../store/usersSlice'
import './UserDetails.css'

const UserDetails = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { userId } = useParams()
  const navigate = useNavigate()
  const users = useSelector(selectUsers)
  
  // Find user from Redux store or fetch if not available
  const user = users.find(u => u.id.toString() === userId)

  useEffect(() => {
    if (!user && users.length === 0) {
      // If no users in store yet, we might need to fetch them
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [user, users.length])

  const handleBackClick = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="user-details-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading user details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="user-details-container">
        <div className="error">
          <p>Error fetching user details: {error}</p>
          <div className="error-buttons">
            <button 
              onClick={() => window.location.reload()} 
              className="retry-button"
            >
              Retry
            </button>
            <button 
              onClick={handleBackClick} 
              className="back-button"
            >
              Back to Users
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="user-details-container">
        <div className="error">
          <p>User not found</p>
          <button 
            onClick={handleBackClick} 
            className="back-button"
          >
            Back to Users
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="user-details-container">
      <button 
        onClick={handleBackClick} 
        className="back-button-top"
      >
        ← Back to Users
      </button>

      <div className="user-details-card">
        <div className="user-header">
          <div className="user-avatar-large">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-header-info">
            <h1 className="user-name-large">{user.name}</h1>
            <p className="user-username">@{user.username}</p>
            <p className="user-email-large">{user.email}</p>
          </div>
        </div>

        <div className="user-details-grid">
          {/* Contact Information */}
          <div className="details-section">
            <h3 className="section-title">Contact Information</h3>
            <div className="detail-item">
              <span className="detail-label">📧 Email</span>
              <a href={`mailto:${user.email}`} className="detail-value email-link">
                {user.email}
              </a>
            </div>
            <div className="detail-item">
              <span className="detail-label">📞 Phone</span>
              <a href={`tel:${user.phone}`} className="detail-value phone-link">
                {user.phone}
              </a>
            </div>
            <div className="detail-item">
              <span className="detail-label">🌐 Website</span>
              <a 
                href={`https://${user.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="detail-value website-link"
              >
                {user.website}
              </a>
            </div>
          </div>

          {/* Address Information */}
          <div className="details-section">
            <h3 className="section-title">Address</h3>
            <div className="detail-item">
              <span className="detail-label">🏠 Street</span>
              <span className="detail-value">
                {user.address.street} {user.address.suite}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">🏙️ City</span>
              <span className="detail-value">{user.address.city}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">📮 Zipcode</span>
              <span className="detail-value">{user.address.zipcode}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">📍 Coordinates</span>
              <span className="detail-value">
                {user.address.geo.lat}, {user.address.geo.lng}
              </span>
            </div>
          </div>

          {/* Company Information */}
          <div className="details-section">
            <h3 className="section-title">Company</h3>
            <div className="detail-item">
              <span className="detail-label">🏢 Name</span>
              <span className="detail-value">{user.company.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">💼 Business</span>
              <span className="detail-value">{user.company.bs}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">💡 Catch Phrase</span>
              <span className="detail-value">"{user.company.catchPhrase}"</span>
            </div>
          </div>

          {/* Additional Information */}
          <div className="details-section">
            <h3 className="section-title">Additional Info</h3>
            <div className="detail-item">
              <span className="detail-label">👤 Username</span>
              <span className="detail-value">{user.username}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">🆔 User ID</span>
              <span className="detail-value">{user.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetails
