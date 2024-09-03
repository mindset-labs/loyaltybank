import { Achievement } from '@apiTypes'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '.'

interface AchievementState {
    achievements: Achievement[]
    total: number
    loading: boolean
    error: string | null
}

const initialState: AchievementState = {
    achievements: [],
    total: 0,
    loading: false,
    error: null
}

export const fetchAchievements = createAsyncThunk(
    'achievements/fetchAchievements',
    async ({ skip, take }: { skip: number, take: number }, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState
            const token = state.auth.token

            const params = new URLSearchParams({
                'skip': skip.toString(),
                'take': take.toString(),
                'include[community]': 'true',
                'include[_count][select][achievementRewards]': 'true'
            })

            const response = await fetch(`/api/achievements?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch achievements')
            }

            const responseData = await response.json()

            return {
                achievements: responseData.data.achievements as Achievement[],
                total: responseData.data.total
            }
        } catch (error) {
            return rejectWithValue('Failed to fetch achievements')
        }
    }
)

const achievementsSlice = createSlice({
    name: 'achievements',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAchievements.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchAchievements.fulfilled, (state, action) => {
                state.loading = false
                state.achievements = action.payload.achievements
                state.total = action.payload.total
            })
            .addCase(fetchAchievements.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || null
            })
    }
})

export default achievementsSlice.reducer

