import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/api';

// Fetch messages action
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (contactId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !contactId) return [];

      const response = await API.get(`/message/get/${contactId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching messages");
    }
  }
);

// Send message action
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ senderId, receiverId, text, socket }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("Unauthorized");

      const messageData = { sender: senderId, receiverId, text };

      socket.emit("sendMessage", messageData);

      const response = await API.post("/message/send", messageData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.newMessage;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error sending message");
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    selectedContact: null,
    messages: [],
    status: 'idle', 
    error: null,
  },
  reducers: {
    setSelectedContact: (state, action) => {
      state.selectedContact = action.payload;
      state.messages = []; // Clear messages when switching contacts
    },
    clearSelectedContact: (state) => {
      state.selectedContact = null;
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { setSelectedContact, clearSelectedContact } = chatSlice.actions;
export default chatSlice.reducer;
