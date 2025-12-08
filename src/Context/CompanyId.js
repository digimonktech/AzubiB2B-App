import React, { createContext, useContext, useState } from 'react';

const CompanyContext = createContext();

// Provider
export const CompanyProvider = ({ children }) => {
    const [companyId, setCompanyId] = useState(null);

    // update company id globally
    const updateCompanyId = (id) => {
        setCompanyId(id);
    };

    return (
        <CompanyContext.Provider value={{ companyId, updateCompanyId }}>
            {children}
        </CompanyContext.Provider>
    );
};

// custom hook
export const useCompany = () => useContext(CompanyContext);
