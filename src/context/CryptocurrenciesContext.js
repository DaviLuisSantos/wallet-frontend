import React, { createContext, useState } from 'react';
import apiClient from '../api/apiClient';

export const CryptocurrenciesContext = createContext();

export const CryptocurrenciesProvider = ({ children }) => {
    const [cryptocurrencies, setCryptocurrencies] = useState([]);

    const fetchCryptocurrencies = async (ids) => {
        try {

            // Verifica se já há dados no estado antes de buscar
            if (cryptocurrencies.length > 0) {
                console.log('Criptos já carregados');
                return;
            }

            const response = await apiClient.post('/crypto/manyy', { ids });

            const data = response.data.map(crypto => ({
                id: crypto.id,
                name: crypto.name,
                symbol: crypto.symbol,
                icon: crypto.icon,
                source: crypto.source,
            }));
            
            setCryptocurrencies(data);
            //return data; // Retorna os dados
        } catch (error) {
            console.error('Erro ao buscar criptomoedas:', error);
            throw error;
        }
    };

    return (
        <CryptocurrenciesContext.Provider value={{ cryptocurrencies, fetchCryptocurrencies }}>
            {children}
        </CryptocurrenciesContext.Provider>
    );
};

export const useCryptocurrencies = () => React.useContext(CryptocurrenciesContext);