import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";

import deviceIdSlice from "../reducers/deviceIdSlice";
import companyIdSlice from "../reducers/companyIdSlice";
import companiesJobListSlice from "../reducers/companiesJobList";
import companiesListSlice from "../reducers/companiesList";
import showcompaniesListSlice from "../reducers/ShowCompaniesList";


const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['companiesJobList', 'companiesList', 'showcompaniesList'],
};

const rootReducer = combineReducers({
    deviceId: deviceIdSlice,
    companyId: companyIdSlice,
    companiesJobList: companiesJobListSlice,
    companiesList: companiesListSlice,  // ✅ corrected
    showcompaniesList: showcompaniesListSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);


















// import AsyncStorage from "@react-native-async-storage/async-storage"
// import { combineReducers, configureStore } from "@reduxjs/toolkit"
// import persistReducer from "redux-persist/es/persistReducer"
// import deviceIdSlice from "../reducers/deviceIdSlice";
// import companyIdSlice from '../reducers/companyIdSlice';
// import companiesJobListSlice from '../reducers/companiesJobList';

// let persistConfig = {
//     key: 'root',
//     storage: AsyncStorage
// }

// let rootReducer = combineReducers({
//     deviceId: deviceIdSlice,
//     companyId: companyIdSlice,
//     companiesJobList: companiesJobListSlice
// });
// let persistedReducer = persistReducer(persistConfig, rootReducer);
// export const myStore = configureStore({
//     reducer: persistedReducer,
// })