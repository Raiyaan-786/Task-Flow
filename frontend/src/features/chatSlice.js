import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        onlineUsers: [],
        messages: [],
    },
    reducers: {
        setOnlineUsers: (store,action) => {
            store.onlineUsers = action.payload; 
        },
        setMessages: (store,action) => {
            store.messages = action.payload; 
        }
    }
});

export const {setOnlineUsers ,setMessages} = chatSlice.actions;

export default chatSlice.reducer;