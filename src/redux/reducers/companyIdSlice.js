import { createSlice } from "@reduxjs/toolkit";
const companyIdSlice = createSlice({
    name: 'companyId',
    initialState: {
        companyId: ''
    },
    reducers: {
        selectCompanyId: (state, action) => {
            return {
                companyId: action.payload,
            }
        }
    }
})
const { actions, reducer } = companyIdSlice;
export const { selectCompanyId } = actions;
export default companyIdSlice.reducer;