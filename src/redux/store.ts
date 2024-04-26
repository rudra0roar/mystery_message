'use client'
import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./features/formSlice"
import generalReducer from "./features/generalSlice"

export const store = configureStore({
    reducer:{
        formReducer,
        generalReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;