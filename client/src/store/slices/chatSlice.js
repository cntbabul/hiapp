import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const getUsers = createAsyncThunk("chat/getUsers", async (_, thunkAPI) => {
    try {
        const res = await axiosInstance.get("/message/users");
        return res.data.users;
    } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const getMessages = createAsyncThunk(
    "chat/getMessages",
    async (userId, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            return res.data.messages;
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const sendMessage = createAsyncThunk(
    "chat/sendMessage",
    async (messageData, thunkAPI) => {
        try {
            const { chat } = thunkAPI.getState();
            const res = await axiosInstance.post(`/message/send/${chat.selectedUser._id}`, messageData);
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Message not sent");
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: [],
        users: [],
        selectedUser: null,
        isUserLoading: false,
        isMessagesLoading: false,
    },
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        pushNewMessage: (state, action) => {
            state.messages.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.isUserLoading = true;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.isUserLoading = false;
                state.users = action.payload;
            })
            .addCase(getUsers.rejected, (state) => {
                state.isUserLoading = false;
            })
            .addCase(getMessages.pending, (state) => {
                state.isMessagesLoading = true;
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.isMessagesLoading = false;
                state.messages = action.payload;
            })
            .addCase(getMessages.rejected, (state) => {
                state.isMessagesLoading = false;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages.push(action.payload.newMessage);
            })
            .addCase(sendMessage.rejected, (state) => {
                state.isMessagesLoading = false;
            })
            .addCase(sendMessage.pending, (state) => {
                state.isMessagesLoading = true;
            })
    }
});

export const { setSelectedUser, pushNewMessage } = chatSlice.actions;
export default chatSlice.reducer;
