import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '.'

interface AggregationsState {
    transactions: {
        date: string
        totalTransactions: number
        totalAmount: number
    }[]
    overallStatistics: {
        totalTransactions: number
        totalTransactionAmount: number
        totalActiveCommunities: number
        totalUsers: number
        averageTransactionAmount: number
        totalRewardAmount: number
    } | null
    loading: boolean
    error: string | null
}

const initialState: AggregationsState = {
    transactions: [],
    overallStatistics: null,
    loading: false,
    error: null,
}

export const fetchTransactionsAggregations = createAsyncThunk(
    'aggregations/fetchTransactionsAggregations',
    async ({ from, to }: { from: Date; to: Date }, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState
            const token = state.auth.token
            const params = new URLSearchParams()

            params.append('from', from.toISOString())
            params.append('to', to.toISOString())

            const response = await fetch(`/api/aggregations/transactions/group?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                method: 'GET',
            })

            if (!response.ok) {
                const errorResponse = await response.json()
                throw new Error(errorResponse.message || 'Failed to fetch aggregations')
            }

            const data = (await response.json()).data.groupedTransactions
            return data
        } catch (error) {
            return rejectWithValue('Failed to fetch aggregations')
        }
    }
)

export const fetchOverallStatistics = createAsyncThunk(
    'aggregations/fetchOverallStatistics',
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState
            const token = state.auth.token

            const response = await fetch('/api/aggregations/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                method: 'GET',
            })

            if (!response.ok) {
                const errorResponse = await response.json()
                throw new Error(errorResponse.message || 'Failed to fetch overall statistics')
            }

            const { data } = await response.json()
            return data.overallStats?.length ? data.overallStats[0] : null
        } catch (error) {
            return rejectWithValue('Failed to fetch overall statistics')
        }
    }
)

const aggregationsSlice = createSlice({
    name: 'aggregations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactionsAggregations.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchTransactionsAggregations.fulfilled, (state, action: PayloadAction<any>) => {
                state.transactions = action.payload
                state.loading = false
            })
            .addCase(fetchTransactionsAggregations.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
                state.transactions = []
            })
        
        builder
            .addCase(fetchOverallStatistics.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchOverallStatistics.fulfilled, (state, action: PayloadAction<any>) => {
                state.overallStatistics = action.payload
                state.loading = false
            })
            .addCase(fetchOverallStatistics.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
                state.overallStatistics = null
            })
    },
})

export default aggregationsSlice.reducer
