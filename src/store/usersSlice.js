import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Generate unique ID for new users (since we're adding locally)
const generateId = () => {
  return Date.now() + Math.random()
}

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
    sortBy: 'name', // 'name', 'email', 'company'
    sortOrder: 'asc', // 'asc', 'desc'
  },
  reducers: {
    addUser: (state, action) => {
      const newUser = {
        ...action.payload,
        id: generateId(),
        username: action.payload.name.toLowerCase().replace(/\s+/g, '.'),
        phone: '1-555-0000',
        website: 'example.com',
        address: {
          street: 'Unknown Street',
          suite: '',
          city: 'Unknown City',
          zipcode: '00000',
          geo: {
            lat: '0.0000',
            lng: '0.0000'
          }
        },
        company: {
          name: action.payload.company || 'Unknown Company',
          catchPhrase: 'New user',
          bs: 'business'
        }
      }
      // Add new user at the beginning of the array
      state.users.unshift(newUser)
    },
    updateUser: (state, action) => {
      const { id, ...updatedData } = action.payload
      const userIndex = state.users.findIndex(user => user.id === id)
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], ...updatedData }
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload)
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload
    },
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc'
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { 
  addUser, 
  updateUser, 
  deleteUser, 
  setSortBy, 
  setSortOrder, 
  toggleSortOrder 
} = usersSlice.actions

// Selectors
export const selectUsers = (state) => state.users.users
export const selectLoading = (state) => state.users.loading
export const selectError = (state) => state.users.error
export const selectSortBy = (state) => state.users.sortBy
export const selectSortOrder = (state) => state.users.sortOrder

// Sorted users selector
export const selectSortedUsers = (state) => {
  const users = selectUsers(state)
  const sortBy = selectSortBy(state)
  const sortOrder = selectSortOrder(state)
  
  const sortedUsers = [...users].sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy) {
      case 'email':
        aValue = a.email.toLowerCase()
        bValue = b.email.toLowerCase()
        break
      case 'company':
        aValue = a.company.name.toLowerCase()
        bValue = b.company.name.toLowerCase()
        break
      case 'name':
      default:
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
    }
    
    if (sortOrder === 'asc') {
      return aValue.localeCompare(bValue)
    } else {
      return bValue.localeCompare(aValue)
    }
  })
  
  return sortedUsers
}

export default usersSlice.reducer
