import React, { useState, useEffect } from 'react';
import CryptoList from '../components/CryptoList';
import { useCryptocurrencies } from '../context/CryptocurrenciesContext';
import { useWallets } from '../context/WalletContext';
import { usePrices } from '../context/PricesContext';
import { fetchData } from '../utils/fetchData';
import { calculatePriceChange } from '../utils/priceUtils';

const Wallet = () => {
    const [cryptoItems, setCryptoItems] = useState([]);
    const [totalValueUSD, setTotalValueUSD] = useState(0);
    const { cryptocurrencies, fetchCryptocurrencies } = useCryptocurrencies();
    const { wallets, fetchWallets } = useWallets();
    const { prices, fetchPrices, latestPrices, fetchLatestPrices } = usePrices();

    useEffect(() => {
        const fetchCryptoItems = async () => {
            try {
                await fetchData(wallets, prices, latestPrices, cryptocurrencies, fetchWallets, fetchPrices, fetchLatestPrices, fetchCryptocurrencies);

                const latestPricesMap = latestPrices.reduce((acc, price) => {
                    acc[price.cryptoId] = price;
                    return acc;
                }, {});

                let totalValueUSD = 0;
                const cryptoItems = [];

                wallets.forEach(balance => {
                    const crypto = cryptocurrencies.find(c => c.id === balance.cryptoId);
                    const price = latestPricesMap[balance.cryptoId];
                    const variation = calculatePriceChange(prices[balance.cryptoId], 24);

                    if (crypto && price) {
                        const balanceValueUSD = balance.amount * price.priceUsd;
                        totalValueUSD += balanceValueUSD;

                        cryptoItems.push({
                            name: crypto.name,
                            symbol: crypto.symbol,
                            balance: balance.amount,
                            value: balanceValueUSD?.toFixed(2),
                            priceUSD: price.priceUsd,
                            icon: crypto.icon,
                            variation: variation.priceChange?.toFixed(2),
                            latestPrices: prices[balance.cryptoId], // Pass all prices for the crypto
                        });
                    }
                });

                setCryptoItems(cryptoItems);
                setTotalValueUSD(totalValueUSD?.toFixed(2));
            } catch (error) {
                console.error('Error fetching crypto items:', error);
            }
        };

        fetchCryptoItems();
    }, [cryptocurrencies, prices, latestPrices, wallets, fetchWallets, fetchCryptocurrencies, fetchPrices, fetchLatestPrices]);

    return (
        <div className="flex flex-col items-center h-screen overflow-hidden">
            <div className="flex flex-col w-full h-full rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold mb-4 text-center text-teal-400">
                    Minha Carteira Cripto
                </h1>

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

                <div className="flex-1 overflow-y-auto">
                    <CryptoList items={cryptoItems} />
                </div>
            </div>
        </div>
    );

};

export default Wallet;