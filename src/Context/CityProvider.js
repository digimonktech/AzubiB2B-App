// CityContext.js
import React, { createContext, useContext, useState } from 'react';

const CityContext = createContext();

export const CityProvider = ({ children }) => {
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedCityId, setSelectedCityId] = useState([]);
    const [showCity, setShowCity] = useState(true);

    const setCity = (city, cityId) => {
        setSelectedCity(city);
        setSelectedCityId(cityId);
    };
    const setVisible = (visible) => {
        setShowCity(visible);
    }
    return (
        <CityContext.Provider value={{ selectedCity, selectedCityId, setCity, showCity, setVisible}}>
            {children}
        </CityContext.Provider>
    );
};

export const useCity = () => {
    return useContext(CityContext);
};
