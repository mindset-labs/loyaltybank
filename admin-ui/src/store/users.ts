import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '.'
import { User } from '@apiTypes'

interface UsersState {
  users: User[]
  loading: boolean
  error: string | null
  total: number
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  total: 0,
}

export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers',
  async ({ skip, take }: { skip: number, take: number }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const URLParams = new URLSearchParams()
      URLParams.append('paging[skip]', skip.toString())
      URLParams.append('paging[take]', take.toString())
      URLParams.append('include[managedBy][select][name]', 'true')
      URLParams.append('include[_count][select][myCommunities]', 'true')
      URLParams.append('include[_count][select][transactionsSent]', 'true')
      URLParams.append('include[_count][select][transactionsReceived]', 'true')

      const response = await fetch(`/api/users?${URLParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        method: 'GET',
      })
      
      if (!response.ok) {
        const errorResponse = await response.json()
        throw new Error(errorResponse.message || 'Failed to fetch users')
      }

      const data = (await response.json()).data
      
      return {
        users: data.users as User[],
        total: data.total as number
      }
    } catch (error) {
      return rejectWithValue('Failed to fetch users')
    }
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<{ users: User[], total: number }>) => {
        state.users = action.payload.users || [] // Ensure users is always an array
        state.total = action.payload.total
        state.loading = false
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.users = [] // Reset users to an empty array on error
      })
  },
})

export default usersSlice.reducer
