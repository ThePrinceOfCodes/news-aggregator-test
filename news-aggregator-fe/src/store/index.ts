import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // Default: localStorage
import { configureStore } from '@reduxjs/toolkit'
import userMgtReducer from './slices/user-management'
import { UserManagementStoreData } from '../interfaces/user-account-interface'
import { PersistConfig } from 'redux-persist/es/types'

const persistConfig: PersistConfig<UserManagementStoreData> = {
  key: 'user-management', // Key for this slice in localStorage
  storage,                // Storage engine
}

const persistedUserMgtReducer = persistReducer(persistConfig, userMgtReducer)

export const store = configureStore({
  reducer: {
    user: persistedUserMgtReducer, // Persisted user-management slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
export const persistor = persistStore(store)
