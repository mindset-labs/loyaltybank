import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '.'

interface EventsState {
    events: Event[]
    loading: boolean
    error: string | null
    total: number
}

const initialState: EventsState = {
    events: [],
    loading: false,
    error: null,
    total: 0,
}

export const fetchEvents = createAsyncThunk(
    'events/fetchEvents',
    async ({ take, skip }: { take: number; skip: number }, { rejectWithValue, getState }) => {
        try {
            const token = (getState() as RootState).auth.token
            const query = new URLSearchParams({
                'paging[take]': take.toString(),
                'paging[skip]': skip.toString(),
                'include[community][select][name]': 'true',
                'include[community][select][id]': 'true',
                'include[_count][select][eventLogs]': 'true',
            })
            const response = await fetch(`/api/events?${query.toString()}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
            if (!response.ok) {
                throw new Error('Failed to fetch events')
            }
            const { data }: { data: { events: Event[], total: number } } = await response.json()
            return { events: data.events, total: data.total }
        } catch (error) {
            return rejectWithValue('Failed to fetch events')
        }
    }
)

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<{ events: Event[], total: number }>) => {
                state.loading = false
                state.events = action.payload.events
                state.total = action.payload.total
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { setIsLoading } = eventsSlice.actions

export default eventsSlice.reducer;
