import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userslice.js'
import conversationReducer from './conversationSlice.js'
import messageReducer from './messageSlice.js'

export const store = configureStore({
  reducer: {
    user: userReducer,
    conversation: conversationReducer,
    message:messageReducer,
  },
})