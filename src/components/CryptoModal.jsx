import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { usePrices } from '../context/PricesContext'; // Use o PricesContext para acessar preços
import CryptoLineChart from './CryptoLineChart';

const CryptoModal = ({ name, symbol, cryptoId, onClose }) => {
    const { prices, fetchPrices } = usePrices();
    const [latestPrices, setLatestPrices] = useState([]);
    const [selectedRange, setSelectedRange] = useState('30d'); // Intervalo padrão: 30 dias

    useEffect(() => {
        const fetchData = async () => {
            if (!prices[cryptoId]) {
                const startTime = new Date();
                startTime.setDate(startTime.getDate() - 30); // Últimos 30 dias
                const endTime = new Date();

                await fetchPrices([cryptoId], startTime.toISOString(), endTime.toISOString());
            } else {
                setLatestPrices(prices[cryptoId]);
            }
        };
        fetchData();
    }, [cryptoId, prices, fetchPrices]);

    useEffect(() => {
        if (prices[cryptoId]) {
            setLatestPrices(prices[cryptoId]);
        }
    }, [prices, cryptoId]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">{name} ({symbol.toUpperCase()})</h2>

                {/* Interval Selector */}
                <div className="flex justify-center space-x-4 mb-4">
                    {['24h', '7d', '30d'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setSelectedRange(range)}
                            className={`px-4 py-2 rounded-md font-medium ${
                                selectedRange === range
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>

                {/* Chart Component */}
                <div className="relative h-80">
                    {latestPrices.length > 0 ? (
                        <CryptoLineChart
                            name={name}
                            latestPrices={latestPrices}
                            selectedRange={selectedRange}
                        />
                    ) : (
                        <p className="text-gray-400 text-center">Loading price data...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

CryptoModal.propTypes = {
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    cryptoId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default CryptoModal;
