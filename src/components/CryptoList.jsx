import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import CryptoItem from './CryptoItem';

const CryptoList = ({ items }) => {
    const [sortKey, setSortKey] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    const handleSort = (key) => {
        setSortOrder(sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc');
        setSortKey(key);
    };

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];

            if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
                return sortOrder === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
            }

            const aString = String(aValue).toLowerCase();
            const bString = String(bValue).toLowerCase();
            return sortOrder === 'asc'
                ? aString.localeCompare(bString)
                : bString.localeCompare(aString);
        });
    }, [items, sortKey, sortOrder]);

    const headers = [
        { label: 'Nome', key: 'name' },
        { label: 'Quantia', key: 'priceUSD' },
        { label: 'Preço', key: 'balance', hiddenOnMobile: true },
        { label: 'Valor', key: 'value', hiddenOnMobile: true },
        { label: 'Variação 24h', key: 'variation', hiddenOnMobile: true },
    ];

    return (
        <div className="flex flex-col gap-4 h-full overflow-hidden">
            {/* Cabeçalhos com botões de ordenação */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4 text-teal-400">
                {headers.map(({ label, key, hiddenOnMobile }) => (
                    <button
                        key={key}
                        onClick={() => handleSort(key)}
                        className={`text-left ${hiddenOnMobile ? 'hidden md:block' : ''}`}
                        aria-sort={sortKey === key ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Lista rolável */}
            <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar">
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
