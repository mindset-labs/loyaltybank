import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import counterReducer from './counterState'
import authReducer from './auth'
import communitiesReducer from './communities'
import usersReducer from './users'
import transactionsReducer from './transactions'
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
}

const rootReducer = combineReducers({
  counter: counterReducer,
  auth: authReducer,
  communities: communitiesReducer,
  users: usersReducer,
  transactions: transactionsReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector