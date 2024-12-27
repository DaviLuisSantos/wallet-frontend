import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { getWallet } from '../api/WalletService';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [wallets, setWallets] = useState([]);

    const fetchWallets = async () => {
        try {

            // Verifica se já há dados no estado antes de buscar
            if (wallets.length > 0) {
                console.log('Carteiras já carregadas');
                return;
            }

            const response = await getWallet();
            const formattedData = response.map(wallet => ({
                crypto_id: wallet.crypto_id,
                balance: wallet.balance,
            }));

            setWallets(formattedData);
            console.log('Carteiras carregadas:', formattedData);
        } catch (error) {
            console.error('Erro ao buscar carteiras:', error);
        }
    };

    return (
        <WalletContext.Provider value={{ wallets, fetchWallets }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallets = () => React.useContext(WalletContext);
