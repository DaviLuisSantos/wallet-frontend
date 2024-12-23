import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [wallets, setWallets] = useState([]);

    useEffect(() => {
        const fetchWallets = async () => {
            try {
                const response = await apiClient.get('/wallet/');
                const formattedData = response.data.map(wallet => ({
                    crypto_id: wallet.crypto_id,
                    balance: wallet.balance
                }));
                setWallets(response.data);
            } catch (error) {
                console.error('Erro ao buscar carteiras:', error);
            }
        };

        fetchWallets();
    }, []);

    return (
        <WalletContext.Provider value={{ wallets }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallets = () => React.useContext(WalletContext);