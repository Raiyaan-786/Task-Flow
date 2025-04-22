import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import chatSlice from '../features/chatSlice'
import socketSlice from '../features/socketSlice'
import notificationSlice from '../features/notificationSlice'
import tenantAuthSlice from '../features/tenantAuthSlice'
import ownerAuthSlice from '../features/ownerAuthSlice'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    tenantAuth:tenantAuthSlice,
    chat: chatSlice,
    socketio: socketSlice,
    notifications: notificationSlice,
    ownerAuth:ownerAuthSlice
  },
})