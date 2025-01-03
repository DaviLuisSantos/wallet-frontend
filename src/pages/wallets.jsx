import React, { useState, useEffect } from 'react';
import CryptoList from '../components/CryptoList';
import { useCryptocurrencies } from '../context/CryptocurrenciesContext';
import { useWallets } from '../context/WalletContext';
import { usePrices } from '../context/PricesContext';
import { calculatePriceChange } from '../utils/priceUtils';

const Wallet = () => {
    const [cryptoItems, setCryptoItems] = useState([]);
    const [totalValueUSD, setTotalValueUSD] = useState(0);
    const { cryptocurrencies, fetchCryptocurrencies } = useCryptocurrencies();
    const { wallets, fetchWallets } = useWallets();
    const { prices, fetchPrices } = usePrices();

    useEffect(() => {
        const fetchCryptoItems = async () => {
            try {
                if (wallets.length === 0) await fetchWallets();

                const ids = wallets.map(wallet => wallet.cryptoId);

                const endTime = new Date().toISOString().split('T')[0];
                const startTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

                if (Object.keys(prices).length === 0) {
                    await fetchPrices(ids, oneDayAgo, endTime);
                    await fetchPrices(ids, startTime, endTime);
                }

                if (cryptocurrencies.length === 0) await fetchCryptocurrencies(ids);

                const latestPrices = ids
                    .map(id => calculatePriceChange(prices[id]))
                    .filter(price => price !== null);

                let totalValueUSD = 0;
                const cryptoItems = [];

                wallets.forEach(balance => {
                    const crypto = cryptocurrencies.find(c => c.id === balance.cryptoId);
                    const price = latestPrices.find(p => p?.cryptoId === balance.cryptoId);

                    if (crypto && price) {
                        const balanceValueUSD = balance.amount * price.priceUsd;
                        totalValueUSD += balanceValueUSD;

                        cryptoItems.push({
                            name: crypto.name,
                            symbol: crypto.symbol,
                            balance: balance.amount,
                            value: balanceValueUSD.toFixed(2),
                            priceUSD: price.priceUsd,
                            icon: crypto.icon,
                            variation: price.priceChange24h.toFixed(2),
                            latestPrices: price.allPrices,
                        });
                    }
                });

                setCryptoItems(cryptoItems);
                setTotalValueUSD(totalValueUSD.toFixed(2));
            } catch (error) {
                console.error('Error fetching crypto items:', error);
            }
        };

        fetchCryptoItems();
    }, [cryptocurrencies, prices, wallets, fetchWallets, fetchCryptocurrencies, fetchPrices]);

    return (
        <div className="flex flex-col gap-4 items-center min-h-screen">
            <div className="flex flex-col w-full h-screen rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold mb-4 text-center text-teal-400">Minha Carteira Cripto</h1>

                <div className="mb-4">
                    <p className="text-lg text-gray-400 text-center">
                        Confira suas criptomoedas e seus respectivos valores.
                    </p>
                </div>

                <div className="m-4">
                    <p className="text-xl font-bold text-center text-teal-400">
                        Valor Total: ${totalValueUSD}
                    </p>
                </div>

                <CryptoList items={cryptoItems} />
            </div>
        </div>
    );
};

export default Wallet;
