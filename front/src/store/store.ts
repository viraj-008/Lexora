import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import storage  from "redux-persist/lib/storage";
import { persistReducer,persistStore,FLUSH,REHYDRATE,PAUSE,PURGE,PERSIST,REGISTER } from "redux-persist";
import  useReducer  from "./slice/userSlice";
import { use } from "react";
import { api } from "./api";

//persist config user
const userPersistConfig = {key:"user",storage,whiteList:["user","isEmailVerified","isLoggedIn"]};

//wrap reducer with persist config
const persistedUserReducer = persistReducer(userPersistConfig,useReducer);

export const store = configureStore({ 
    reducer:{
       [api.reducerPath]: api.reducer,
       user: persistedUserReducer
    },
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PURGE, PERSIST, REGISTER],
            },
        }).concat(api.middleware)
    
 })

// setup the Listeners for rtk querry
 setupListeners(store.dispatch);

 //create a persister
 export const persistor = persistStore(store);


 // Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch