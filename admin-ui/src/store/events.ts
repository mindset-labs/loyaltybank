import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '.'

interface EventsState {
    events: Event[]
    loading: boolean
    error: string | null
}

const initialState: EventsState = {
    events: [],
    loading: false,
    error: null,
}

export const fetchEvents = createAsyncThunk(
    'events/fetchEvents',
    async (_, { rejectWithValue, getState }) => {
        try {
            const token = (getState() as RootState).auth.token
            const query = new URLSearchParams({
                'paging[take]': '10',
                'paging[skip]': '0',
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
            const { data }: { data: { events: Event[] } } = await response.json()
            return data.events
        } catch (error) {
            return rejectWithValue('Failed to fetch events')
        }
    }
)

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
                state.loading = false
                state.events = action.payload
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export default eventsSlice.reducer;
