import React, { createContext, useState, useEffect } from 'react';
import { getWallet } from '../api/WalletService';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [wallets, setWallets] = useState([]);

    useEffect(() => {
        // Retrieve wallets from local storage if available
        const savedWallets = typeof window !== 'undefined' ? localStorage.getItem('wallets') : null;
        if (savedWallets) {
            setWallets(JSON.parse(savedWallets));
        }
    }, []);

    const fetchWallets = async () => {
        try {
            // Verifica se já há dados no estado antes de buscar
            if (wallets.length > 0) {
                console.log('Carteiras já carregadas');
                return;
            }

            const response = await getWallet();
            const formattedData = response.map(wallet => ({
                cryptoId: wallet.cryptoId,
                amount: wallet.amount,
            }));

            setWallets(formattedData);
            // Save wallets to local storage
            if (typeof window !== 'undefined') {
                localStorage.setItem('wallets', JSON.stringify(formattedData));
            }
            console.log('Carteiras carregadas:', formattedData);
        } catch (error) {
            console.error('Erro ao buscar carteiras:', error);
        }
    };

    useEffect(() => {
        // Fetch wallets if not already loaded
        if (wallets.length === 0) {
            fetchWallets();
        }
    }, [wallets]);

    return (
        <WalletContext.Provider value={{ wallets, fetchWallets }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallets = () => React.useContext(WalletContext);