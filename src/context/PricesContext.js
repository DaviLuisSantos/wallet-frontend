import React, { createContext, useState, useContext, useCallback } from 'react';
import { getPricesId } from '../api/PriceService';

const PricesContext = createContext();

export const PricesProvider = ({ children }) => {
    const [prices, setPrices] = useState({});

    const fetchPrices = useCallback(async (ids) => {
        try {
            // Check if prices for the given IDs are already available
            const missingIds = ids.filter(id => !prices[id] || prices[id].length === 0);
            if (missingIds.length === 0) {
                console.log('Prices already fetched for all IDs');
                return;
            }

            const pricesData = await getPricesId(missingIds);

            // Organize the prices by crypto_id
            const organizedPrices = missingIds.reduce((acc, id) => {
                acc[id] = pricesData.filter(price => price.CryptoId === id);
                return acc;
            }, {});

            setPrices(prevPrices => ({
                ...prevPrices,
                ...organizedPrices,
            }));
            console.log('Prices fetched and organized by crypto_id');
        } catch (error) {
            console.error('Erro ao buscar preços:', error);
        }
    }, [prices]);

    return (
        <PricesContext.Provider value={{ prices, fetchPrices }}>
            {children}
        </PricesContext.Provider>
    );
};

export const usePrices = () => useContext(PricesContext);