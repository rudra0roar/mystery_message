import { createSlice } from "@reduxjs/toolkit";

type initialState = {
    colorOptions : string
}

const initialState = {
    colorOptions : "zinc"
}


const generalSlice = createSlice({
    name : "generalSlice",
    initialState : initialState,
    reducers : {
        signUpBoxState(state , action){
            state.colorOptions = action.payload
        }
    }
})

export const {signUpBoxState} = generalSlice.actions;
export default generalSlice.reducer;