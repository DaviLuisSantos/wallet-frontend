import React, { createContext, useState } from 'react';
import apiClient from '../api/apiClient';

export const CryptocurrenciesContext = createContext();

export const CryptocurrenciesProvider = ({ children }) => {
    const [cryptocurrencies, setCryptocurrencies] = useState([]);

    const fetchCryptocurrencies = async (ids) => {
        try {
            const response = await apiClient.post('/crypto/manyy', { ids });
            const data = response.data;
            const formattedData = data.map(crypto => ({
                id: crypto.id,
                name: crypto.name,
                symbol: crypto.symbol,
                icon: crypto.icon,
                source: crypto.source,
            }));
            setCryptocurrencies(formattedData);
            console.log('Cryptocurrencies fetched:', formattedData);
        } catch (error) {
            console.error('Erro ao buscar criptomoedas:', error);
        }
    };

    return (
        <CryptocurrenciesContext.Provider value={{ cryptocurrencies, fetchCryptocurrencies }}>
            {children}
        </CryptocurrenciesContext.Provider>
    );
};

export const useCryptocurrencies = () => React.useContext(CryptocurrenciesContext);