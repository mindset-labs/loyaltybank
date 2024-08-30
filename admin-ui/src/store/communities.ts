import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Community } from '@apiTypes'
import { RootState } from '.'

interface CommunitiesState {
    communities: Community[]
    loading: boolean
    error: string | null
}

const initialState: CommunitiesState = {
    communities: [],
    loading: false,
    error: null,
}

export const fetchMyCommunities = createAsyncThunk(
  'communities/fetchMyCommunities',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const params = new URLSearchParams({
        'include[memberships]': 'true'
      });

      const response = await fetch(`/api/communities/me?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        method: 'GET',
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch communities')
      }
      
      return (await response.json()).data.communities as Community[]
    } catch (error) {
      return rejectWithValue('Failed to fetch communities')
    }
  }
)

const communitiesSlice = createSlice({
    name: 'communities',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyCommunities.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchMyCommunities.fulfilled, (state, action: PayloadAction<Community[]>) => {
                state.communities = action.payload
                state.loading = false
            })
            .addCase(fetchMyCommunities.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export default communitiesSlice.reducer
