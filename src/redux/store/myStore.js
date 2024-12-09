import AsyncStorage from "@react-native-async-storage/async-storage"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import persistReducer from "redux-persist/es/persistReducer"
import deviceIdSlice from "../reducers/deviceIdSlice";

let persistConfig = {
    key: 'root',
    storage: AsyncStorage
}

let rootReducer = combineReducers({ deviceId: deviceIdSlice });
let persistedReducer = persistReducer(persistConfig, rootReducer);
export const myStore = configureStore({
    reducer: persistedReducer,
})