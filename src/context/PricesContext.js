import React, { createContext, useState, useContext } from 'react';
import apiClient from '../api/apiClient';

const PricesContext = createContext();

export const PricesProvider = ({ children }) => {
    const [prices, setPrices] = useState([]);

    const fetchPrices = async (ids) => {
        try {

            // Verifica se já há dados no estado antes de buscar
            if (prices.length > 0) {
                console.log('Preços já carregados:', prices);
                return;
            }

            const response = await apiClient.post('/price/manyy', { ids });
            const pricesData = response.data;
            setPrices(pricesData);
            //return pricesData;
            console.log('Prices fetched:', pricesData);
        } catch (error) {
            console.error('Erro ao buscar preços:', error);
        }
    };

    return (
        <PricesContext.Provider value={{ prices, fetchPrices }}>
            {children}
        </PricesContext.Provider>
    );
};

export const usePrices = () => useContext(PricesContext);