'use client'

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { string } from "zod";

type initialState = {
    email : string 
}

const initialState: initialState = {
    email : localStorage.getItem('email') ? JSON.stringify(localStorage.getItem('email')) : ""
}

const formSlice = createSlice({
    name:"formData",
    initialState: initialState,
    reducers:{
        emailPassToVerifyCode(state , action){
            localStorage.setItem("email" , action.payload)
            state.email = action.payload
        }
    }
})

export const{emailPassToVerifyCode} = formSlice.actions
export default formSlice.reducer