import { createSlice } from "@reduxjs/toolkit";
const deviceIdSlice = createSlice({
    name: 'deviceId',
    initialState: {
        deviceId: {}
    },
    reducers: {
        selectDeviceId: (state, action) => {
            return {
                deviceId: action.payload,
            }
        }
    }
})
const { actions, reducer } = deviceIdSlice;
export const { selectDeviceId } = actions;
export default deviceIdSlice.reducer;