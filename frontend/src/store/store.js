import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import chatReducer from '../features/chatSlice'
import socketMiddleware from '../features/socketMiddleware'

export const store = configureStore({
  reducer: {
    auth:authReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return [...getDefaultMiddleware(), socketMiddleware]
  }
})