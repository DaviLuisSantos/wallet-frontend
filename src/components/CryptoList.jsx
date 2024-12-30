import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CryptoItem from './CryptoItem';

const CryptoList = ({ items }) => {
    const [sortKey, setSortKey] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const sortedItems = [...items].sort((a, b) => {
        // Tentar converter os valores para números
        const aValue = Number(a[sortKey]);
        const bValue = Number(b[sortKey]);

        // Se ambos forem números válidos, fazer a comparação numérica
        if (!isNaN(aValue) && !isNaN(bValue)) {
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }

        // Caso contrário, ordenar alfabeticamente (para strings)
        const aString = String(a[sortKey]);
        const bString = String(b[sortKey]);
        return sortOrder === 'asc'
            ? aString.localeCompare(bString)
            : bString.localeCompare(aString);
    });



    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-5 gap-4 mb-4 text-teal-400">
                <button onClick={() => handleSort('name')} className="text-left">Nome</button>
                <button onClick={() => handleSort('priceUSD')} className="text-left">Quantia</button>
                <button onClick={() => handleSort('balance')} className="text-left">Preço</button>
                <button onClick={() => handleSort('value')} className="text-left">Valor</button>
                <button onClick={() => handleSort('variation')} className="text-left">Variação 24h</button>
            </div>
            {sortedItems.map((item, index) => (
                <CryptoItem
                    key={index}
                    icon={item.icon}
                    symbol={item.symbol}
                    name={item.name}
                    priceUSD={item.priceUSD}
                    balance={item.balance}
                    value={item.value}
                    variation={item.variation}
                    latestPrices={item.latestPrices}
                />
            ))}
        </div>
    );
};

CryptoList.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            symbol: PropTypes.string.isRequired,
            priceUSD: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            variation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            latestPrices: PropTypes.arrayOf(
                PropTypes.shape({
                    timestamp: PropTypes.string.isRequired,
                    price_usd: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                })
            ).isRequired,
        })
    ).isRequired,
};

export default CryptoList;