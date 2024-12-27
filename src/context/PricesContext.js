import React, { createContext, useState, useContext } from 'react';
import { getPricesId } from '../api/PriceService';

const PricesContext = createContext();

export const PricesProvider = ({ children }) => {
    const [prices, setPrices] = useState({});

    const fetchPrices = async (ids) => {
        try {
            const pricesData = await getPricesId(ids);

            // Organizar os preços por crypto_id
            const organizedPrices = ids.reduce((acc, id) => {
                acc[id] = pricesData.filter(price => price.crypto_id === id);
                return acc;
            }, {});

            setPrices(organizedPrices);
            console.log('Prices fetched and organized by crypto_id');
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