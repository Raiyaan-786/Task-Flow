import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import chatSlice from '../features/chatSlice'
import socketSlice from '../features/socketSlice'
import notificationSlice from '../features/notificationSlice'
import tenantAuthSlice from '../features/tenantAuthSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tenantAuth:tenantAuthSlice,
    chat: chatSlice,
    socketio: socketSlice,
    notifications: notificationSlice
  },
})