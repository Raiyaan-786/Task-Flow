import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name: "socketio",
    initialState: {
        socket: null
    },
    reducers: {
        setSocket: (store,action) => {
            store.socket = action.payload; 
        }
    }
});

export const {setSocket} = socketSlice.actions;
export default socketSlice.reducer;