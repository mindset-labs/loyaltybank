import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
    isAuthenticated: boolean
    token: string | null
    user: null | Record<string, any>
    loading: boolean
    error: string | null
}

const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    user: null,
    loading: false,
    error: null,
}

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const loginResponse = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            })

            if (!loginResponse.ok) {
                const responseData = await loginResponse.json()
                throw new Error(responseData.message || 'Login failed')
            }

            const responseData = await loginResponse.json();

            const myInfoResponse = await fetch('/api/users/me', {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${responseData.data.token}`
                },
            })

            if (!myInfoResponse.ok) {
                const responseData = await myInfoResponse.json();
                throw new Error(responseData.message || 'Failed to fetch user information')
            }

            const myInfoResponseData = await myInfoResponse.json();

            return {
                token: responseData.data.token,
                user: myInfoResponseData.data.user,
            }
        } catch (error) {
            return rejectWithValue((error as Error).message)
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false
            state.user = null
        },
    },
    extraReducers: (builder) => {
        // login extra reducers
        builder
            .addCase(login.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: Record<string, any> }>) => {
                state.isAuthenticated = true
                state.user = action.payload.user
                state.token = action.payload.token
                state.loading = false
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
