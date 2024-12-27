import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import CryptoLineChart from './CryptoLineChart';

const defaultIcon = '';
const CryptoItem = ({ icon, name, symbol, priceUSD, balance, value, variation, latestPrices }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedRange, setSelectedRange] = useState('24h');

    const iconPath = icon
        ? `data:image/png;base64, ${icon}`
        : defaultIcon;

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="bg-gray-800 rounded-lg p-4 shadow hover:bg-gray-700 transition duration-200">
            <div className="grid grid-cols-5 gap-4 items-center cursor-pointer" onClick={toggleExpand}>
                {/* Ícone e Nome */}
                <div className="flex items-center">
                    <Image
                        src={iconPath}
                        alt={`${name} icon`}
                        width={64}
                        height={64}
                        className="rounded-full mr-4"
                    />
                    <div className="flex flex-col">
                        <h3 className="text-white font-semibold">{name}</h3>
                        <span className="text-gray-400">({symbol})</span>
                    </div>
                </div>

                {/* Preço */}
                <div className="text-gray-400">
                    <p>${priceUSD}</p>
                </div>

                {/* Saldo */}
                <div className="text-gray-400">
                    <p>{balance}</p>
                </div>

                {/* Valor */}
                <div className="text-teal-400 font-medium">
                    <p>${value}</p>
                </div>

                {/* Variação */}
                <div className="text-gray-400">
                    <p>{variation}%</p>
                </div>
            </div>

            {isExpanded && (
                <div className="mt-4 bg-gray-700 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">Últimos Valores</h4>
                    <div className="flex justify-end space-x-2 mb-4">
                        <button
                            onClick={() => setSelectedRange('24h')}
                            className={`px-4 py-2 rounded ${selectedRange === '24h' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                        >
                            24h
                        </button>
                        <button
                            onClick={() => setSelectedRange('7d')}
                            className={`px-4 py-2 rounded ${selectedRange === '7d' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                        >
                            7d
                        </button>
                        <button
                            onClick={() => setSelectedRange('30d')}
                            className={`px-4 py-2 rounded ${selectedRange === '30d' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                        >
                            30d
                        </button>
                    </div>
                    <div className="h-96"> {/* Aumenta a altura do gráfico */}
                        <CryptoLineChart name={name} latestPrices={latestPrices} selectedRange={selectedRange} />
                    </div>
                </div>
            )}
        </div>
    );
};

CryptoItem.propTypes = {
    icon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    priceUSD: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    variation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    latestPrices: PropTypes.arrayOf(PropTypes.shape({
        timestamp: PropTypes.string.isRequired,
        price_usd: PropTypes.number.isRequired,
    })).isRequired,
};

export default CryptoItem;