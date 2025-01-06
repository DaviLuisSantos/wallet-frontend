import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import Image from 'next/image';
import CryptoModal from './CryptoModal'; // Componente do Modal

const CryptoCard = ({ icon, name, symbol, variation, lastValue, sparklineData, cryptoId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isPositive = variation >= 0; // Definição de isPositive
    const iconPath = `data:image/png;base64, ${icon}`;
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <>
            <div
                className="relative bg-gray-800 rounded-2xl shadow-custom p-4 m-auto text-white cursor-pointer"
                onClick={handleOpenModal}
            >
                {/* Ícone e Nome */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <Image src={iconPath} alt={`${name} Icon`} width={40} height={40} className="rounded-full" />
                        <div className="ml-3">
                            <p className="text-lg font-semibold">{name}</p>
                            <p className="text-sm text-gray-400">{symbol}</p>
                        </div>
                    </div>
                    <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${isPositive ? 'bg-green-600' : 'bg-red-600'
                            }`}
                    >
                        {isPositive ? <FaArrowUp /> : <FaArrowDown />}
                    </div>
                </div>

                {/* Valor */}
                <div className="flex justify-between items-center mb-4">
                    <p className="text-2xl font-bold">${lastValue.toLocaleString()}</p>
                    <div className="w-24 h-8">
                        <Sparklines data={sparklineData} limit={10}>
                            <SparklinesLine
                                color={isPositive ? '#4ade80' : '#f87171'}
                                style={{ strokeWidth: 3, strokeLinecap: 'round' }}
                            />
                        </Sparklines>
                    </div>
                </div>

                {/* Variação */}
                <p className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}
                    {variation.toFixed(2)}%
                </p>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <CryptoModal
                    name={name}
                    symbol={symbol}
                    cryptoId={cryptoId}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

CryptoCard.propTypes = {
    icon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    variation: PropTypes.number.isRequired,
    lastValue: PropTypes.number.isRequired,
    sparklineData: PropTypes.arrayOf(PropTypes.number).isRequired,
    cryptoId: PropTypes.string.isRequired, // Adicionado como obrigatório
};

export default CryptoCard;
