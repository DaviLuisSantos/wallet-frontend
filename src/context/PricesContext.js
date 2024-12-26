import React, { createContext, useState, useContext } from 'react';
import { getPricesId } from '../api/PriceService';

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

            const pricesData = await getPricesId(ids);

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