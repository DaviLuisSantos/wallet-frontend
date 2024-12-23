import React, { createContext, useState, useContext } from 'react';
import apiClient from '../api/apiClient';

const PricesContext = createContext();

export const PricesProvider = ({ children }) => {
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPrices = async (ids) => {
        try {
            setLoading(true);
            const response = await apiClient.post('/price/manyy', { ids });
            const pricesData = response.data;
            setPrices(pricesData);
            console.log('Prices fetched:', pricesData);
        } catch (error) {
            console.error('Erro ao buscar preços:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PricesContext.Provider value={{ prices, fetchPrices, loading }}>
            {children}
        </PricesContext.Provider>
    );
};

export const usePrices = () => {
    const context = useContext(PricesContext);
    if (!context) {
        throw new Error('usePrices deve ser usado dentro de um PricesProvider');
    }
    return context;
};