// CityAlertContext.js
import React, { createContext, useContext, useState } from 'react';

const CityAlertContext = createContext();

export const CityAlertsProvider = ({ children }) => {
    const [selectedCityAlerts, setSelectedCityAlerts] = useState('');
    const [selectedCityAlertsId, setSelectedCityAlertsId] = useState([]);


    const setCityAlerts = (cityAlert, cityIdAlert) => {
        setSelectedCityAlerts(cityAlert);
        setSelectedCityAlertsId(cityIdAlert);
    };

    return (
        <CityAlertContext.Provider value={{ selectedCityAlerts, selectedCityAlertsId, setCityAlerts }}>
            {children}
        </CityAlertContext.Provider>
    );
};

export const useCityAlerts = () => {
    return useContext(CityAlertContext);
};
