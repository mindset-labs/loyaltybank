import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '.'
import { Transaction } from '@apiTypes'

interface TransactionsState {
  transactions: Transaction[]
  loading: boolean
  error: string | null
  total: number
}

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
  total: 0,
}

export const fetchAllTransactions = createAsyncThunk(
  'transactions/fetchAllTransactions',
  async ({ skip, take }: { skip: number, take: number }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const URLParams = new URLSearchParams()
      URLParams.append('include[sender][select][name]', 'true')
      URLParams.append('include[receiver][select][name]', 'true')
      URLParams.append('include[community][select][name]', 'true')
      URLParams.append('paging[skip]', skip.toString())
      URLParams.append('paging[take]', take.toString())

      const response = await fetch(`/api/transactions?${URLParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        method: 'GET',
      })
      
      if (!response.ok) {
        const errorResponse = await response.json()
        throw new Error(errorResponse.message || 'Failed to fetch transactions')
      }

      const data = (await response.json()).data
      
      return {
        transactions: data.transactions as Transaction[],
        total: data.total,
      }
    } catch (error) {
      return rejectWithValue('Failed to fetch transactions')
    }
  }
)

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action: PayloadAction<{ transactions: Transaction[], total: number }>) => {
        state.transactions = action.payload.transactions || []
        state.total = action.payload.total
        state.loading = false
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.transactions = [] // Reset transactions to an empty array on error
      })
  },
})

export default transactionsSlice.reducer
