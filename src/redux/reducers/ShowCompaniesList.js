import { createSlice } from "@reduxjs/toolkit";

const showcompaniesList = createSlice({
    name: "showcompaniesList",
    initialState: {
        list: [],
    },
    reducers: {
        addCompany: (state, action) => {
            const newJobs = action.payload;

            // Merge + remove duplicates by job._id
            const merged = [...state.list, ...newJobs];
            const unique = merged.filter(
                (job, index, self) =>
                    index === self.findIndex(j => j._id === job._id)
            );

            state.list = unique;
        },

        removeCompany: (state, action) => {
            state.list = state.list.filter(job => job._id !== action.payload);
        },

        clearCompanyList: (state) => {
            state.list = [];
        }
    },
});

export const { addCompany, removeCompany, clearCompanyList } = showcompaniesList.actions;

export default showcompaniesList.reducer;
