import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  user: any | null;
  isEmailVerified: boolean;
  isLoginDialogOpen: boolean;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  user: null,
  isEmailVerified: false,
  isLoginDialogOpen: false,
  isLoggedIn: false,
};

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        setUser:(state,action)=>{
            state.user = action.payload;
        },
        setEmailVerified:(state,action)=>{
            state.isEmailVerified = action.payload;
        },
        
        logOut:(state)=>{
            state.user = null;
            state.isEmailVerified = false;
            state.isLoginDialogOpen = false;
            state.isLoggedIn = false;
        },
       toggleLoginDialog:(state)=>{
        state.isLoginDialogOpen = !state.isLoginDialogOpen;
    },
    authStatus:(state)=>{
        state.isLoggedIn = true;
        // Check if there was a Google login in progress
        if (typeof window !== 'undefined' && localStorage.getItem('googleLoginInProgress')) {
            state.isLoginDialogOpen = false;
            localStorage.removeItem('googleLoginInProgress');
        }
    }

    }
});

export const {setUser,setEmailVerified,logOut,toggleLoginDialog,authStatus} = userSlice.actions;
export default userSlice.reducer;
