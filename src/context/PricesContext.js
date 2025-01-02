import React, { createContext, useState, useContext, useCallback } from 'react';
import { getPricesId } from '../api/PriceService';

const PricesContext = createContext();

export const PricesProvider = ({ children }) => {
    const [prices, setPrices] = useState({});

    const fetchPrices = useCallback(async (ids, startTime, endTime) => {
        try {
            // Check if prices for the given IDs are already available
            const missingIds = ids.filter(id => !prices[id] || prices[id].length === 0);
            if (missingIds.length === 0) {
                console.log('Prices already fetched for all IDs');
                return;
            }

            const pricesData = await getPricesId(missingIds, startTime, endTime);

            // Organize the prices by crypto_id
            const organizedPrices = pricesData.reduce((acc, price) => {
                if (!acc[price.cryptoId]) {
                    acc[price.cryptoId] = [];
                }
                acc[price.cryptoId].push(price);
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