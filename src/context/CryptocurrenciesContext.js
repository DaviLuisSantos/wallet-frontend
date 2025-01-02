import React, { createContext, useState } from 'react';
import apiClient from '../api/apiClient';

export const CryptocurrenciesContext = createContext();

export const CryptocurrenciesProvider = ({ children }) => {
    const [cryptocurrencies, setCryptocurrencies] = useState([]);

    const fetchCryptocurrencies = async (ids) => {
        try {
            // Verifica se ids está vazio
            if (!ids || ids.length === 0) {
                console.log('Nenhum ID fornecido para buscar criptomoedas');
                return;
            }

            // Verifica se já há dados no estado antes de buscar
            if (cryptocurrencies.length > 0) {
                console.log('Criptos já carregados');
                return;
            }

            const queryString = ids.map(id => `${id}`).join(',');

            const response = await apiClient.get(`/api/Cryptocurrency/ids/${queryString}`);

            const data = response.data.map(crypto => ({
                id: crypto.id,
                name: crypto.name,
                symbol: crypto.symbol,
                icon: crypto.icon,
                source: crypto.source,
            }));

            setCryptocurrencies(data);
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