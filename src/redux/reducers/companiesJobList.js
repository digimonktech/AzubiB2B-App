import { createSlice } from "@reduxjs/toolkit";

const companiesJobListSlice = createSlice({
    name: "companiesJobList",
    initialState: {
        list: [],
    },
    reducers: {
        addJobsFromCompany: (state, action) => {
            const newJobs = action.payload;

            newJobs.forEach(job => {
                const exists = state.list.some(item => item._id === job._id);
                if (!exists) {
                    state.list.push(job);
                }
            });
        },

        removeJob: (state, action) => {
            state.list = state.list.filter(job => job._id !== action.payload);
        },

        clearJobList: (state) => {
            state.list = [];
        },

        removeJobsByCompanyId: (state, action) => {
            const companyId = action.payload;
            state.list = state.list.filter(
                job => job?.companyId?._id !== companyId
            );
        }
    },
});

export const { addJobsFromCompany, removeJob, clearJobList, removeJobsByCompanyId } = companiesJobListSlice.actions;

export default companiesJobListSlice.reducer;
