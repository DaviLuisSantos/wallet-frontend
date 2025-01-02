import React, { createContext, useState, useContext, useCallback } from 'react';
import { getPricesId } from '../api/PriceService';

const PricesContext = createContext();

export const PricesProvider = ({ children }) => {
    const [prices, setPrices] = useState(() => {
        const savedPrices = typeof window !== 'undefined' ? localStorage.getItem('prices') : null;
        return savedPrices ? JSON.parse(savedPrices) : {};
    });

    const fetchPrices = useCallback(async (ids, startTime, endTime) => {
        try {
            if (!ids || ids.length === 0) return;
            const pricesData = await getPricesId(ids, startTime, endTime);

            // Organize prices by crypto_id
            const organizedPrices = pricesData.reduce((acc, price) => {
                if (!acc[price.cryptoId]) {
                    acc[price.cryptoId] = [];
                }
                acc[price.cryptoId].push(price);
                return acc;
            }, {});

            // Update state functionally to avoid stale state issues
            setPrices((prevPrices) => {
                const updatedPrices = {
                    ...prevPrices,
                    ...Object.keys(organizedPrices).reduce((acc, key) => {
                        acc[key] = [...(prevPrices[key] || []), ...organizedPrices[key]];
                        return acc;
                    }, {}),
                };

                /*
                // Save updated prices to local storage
                if (typeof window !== 'undefined') {
                    localStorage.setItem('prices', JSON.stringify(updatedPrices));
                }
                */

                return updatedPrices;
            });

            console.log('Prices fetched and updated successfully');
        } catch (error) {
            console.error('Erro ao buscar preços:', error);
        }
    }, []);

    return (
        <PricesContext.Provider value={{ prices, fetchPrices }}>
            {children}
        </PricesContext.Provider>
    );
};

export const usePrices = () => useContext(PricesContext);