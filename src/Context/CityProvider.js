// CityContext.js
import React, { createContext, useContext, useState } from 'react';

const CityContext = createContext();

export const CityProvider = ({ children }) => {
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedCityId, setSelectedCityId] = useState([]);


    const setCity = (city, cityId) => {
        setSelectedCity(city);
        setSelectedCityId(cityId);
    };

    return (
        <CityContext.Provider value={{ selectedCity, selectedCityId, setCity }}>
            {children}
        </CityContext.Provider>
    );
};

export const useCity = () => {
    return useContext(CityContext);
};
