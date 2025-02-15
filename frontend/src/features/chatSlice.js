import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedContact: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSelectedContact: (state, action) => {
      state.selectedContact = action.payload;
    },
    clearSelectedContact: (state) => {
      state.selectedContact = null;
    },
  },
});

export const { setSelectedContact, clearSelectedContact } = chatSlice.actions;
export default chatSlice.reducer;
