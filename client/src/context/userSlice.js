import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username : null,
    userId:null,
    conversations:[],
    messages:[],
    email : null,
    picture : null,
    room : null,
    socket : null,
}

export const userSlice = createSlice({
    name : "user",
    initialState,
    reducers :  {
        addUser : (state,action) =>{

            const { userId,username,conversations,messages,email,picture, } = action.payload;
            state.username = username;
            state.conversations = conversations;
            state.picture = picture;
            state.email = email;
            state.userId = userId;
            state.messages = messages;
        },
        addSocket : (state,action) =>{
            state.socket = action.payload;
        },
        addRoom : (state,action) =>{
            state.room = action.payload;
        }
    }
});

export const { addUser,addSocket,addRoom } = userSlice.actions;
export default userSlice.reducer;