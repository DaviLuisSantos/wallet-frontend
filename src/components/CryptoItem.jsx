import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

const defaultIcon = '';
const CryptoItem = ({ icon, name, symbol, priceUSD, balance, value }) => {
    const iconPath = icon
        ? `data:image/png;base64, ${icon}`
        : defaultIcon;

    return (
        <div className="grid grid-cols-4 gap-4 items-center bg-gray-800 rounded-lg p-4 shadow hover:bg-gray-700 transition duration-200">
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
};

export default CryptoItem;