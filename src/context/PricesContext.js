import React, { createContext, useState, useContext, useCallback } from 'react';
import { getPricesId, getPriceIds } from '../api/PriceService';

const PricesContext = createContext();

export const PricesProvider = ({ children }) => {
    const [prices, setPrices] = useState(() => {
        const savedPrices = typeof window !== 'undefined' ? localStorage.getItem('prices') : null;
        return savedPrices ? JSON.parse(savedPrices) : {};
    });

    const [latestPrices, setLatestPrices] = useState([]);

    const fetchPrices = useCallback(async (ids, startTime, endTime) => {
        try {
            if (!ids || ids.length === 0) return;

            const pricesData = await getPricesId(ids, startTime, endTime);

            // Organizar preços por cryptoId, garantindo que não haja duplicatas
            const organizedPrices = pricesData.reduce((acc, price) => {
                if (!acc[price.cryptoId]) {
                    acc[price.cryptoId] = {};
                }

                // Garante que cada `timestamp` seja único para o mesmo `cryptoId`
                acc[price.cryptoId][price.timestamp] = price;

                return acc;
            }, {});

            // Atualizar estado evitando duplicatas
            setPrices((prevPrices) => {
                const updatedPrices = { ...prevPrices };

                for (const cryptoId in organizedPrices) {
                    if (!updatedPrices[cryptoId]) {
                        updatedPrices[cryptoId] = [];
                    }

                    const uniquePrices = Object.values(organizedPrices[cryptoId]); // Remove duplicatas por timestamp

                    // Adiciona preços únicos ao estado
                    updatedPrices[cryptoId] = [
                        ...updatedPrices[cryptoId].filter(
                            (price) =>
                                !uniquePrices.some((newPrice) => newPrice.timestamp === price.timestamp)
                        ),
                        ...uniquePrices,
                    ];
                }

                return updatedPrices;
            });

            console.log('Prices fetched and updated successfully');
        } catch (error) {
            console.error('Erro ao buscar preços:', error);
        }
    }, []);

    const fetchLatestPrices = useCallback(async (ids) => {
        try {
            if (!ids || ids.length === 0) return;

            const pricesData = await getPriceIds(ids);

            // Organizar os preços mais recentes, garantindo que não haja duplicatas
            const uniqueLatestPrices = ids.map((id) => {
                const latestPrice = pricesData.find((price) => price.cryptoId === id);
                return latestPrice || null;
            }).filter(Boolean);

            setLatestPrices(uniqueLatestPrices);
            console.log('Latest prices fetched and updated successfully');
        } catch (error) {
            console.error('Erro ao buscar os últimos preços:', error);
        }
    }, []);

    return (
        <PricesContext.Provider value={{ prices, fetchPrices, latestPrices, fetchLatestPrices }}>
            {children}
        </PricesContext.Provider>
    );
};

export const usePrices = () => useContext(PricesContext);
