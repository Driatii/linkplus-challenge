import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addUser } from '../store/usersSlice'
import './AddUser.css'

const AddUser = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const onSubmit = (data) => {
    dispatch(addUser(data))
    reset()
    navigate('/')
  }

  const handleCancel = () => {
    navigate('/')
  }

  return (
    <div className="add-user-container">
      <button 
        onClick={handleCancel} 
        className="back-button-top"
      >
        ← Back to Users
      </button>

      <div className="add-user-card">
        <h2 className="form-title">Add New User</h2>
        <p className="form-subtitle">Create a new user profile</p>

        <form onSubmit={handleSubmit(onSubmit)} className="add-user-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Enter full name"
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                },
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: 'Name can only contain letters and spaces'
                }
              })}
            />
            {errors.name && (
              <span className="error-message">{errors.name.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter email address"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Please enter a valid email address'
                }
              })}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="company" className="form-label">
              Company (Optional)
            </label>
            <input
              id="company"
              type="text"
              className="form-input"
              placeholder="Enter company name"
              {...register('company')}
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleCancel}
              className="cancel-button"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddUser
