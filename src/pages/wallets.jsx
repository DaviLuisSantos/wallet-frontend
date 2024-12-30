import React, { useState, useEffect } from 'react';
import CryptoList from '../components/CryptoList';
import { useCryptocurrencies } from '../context/CryptocurrenciesContext';
import { useWallets } from '../context/WalletContext';
import { usePrices } from '../context/PricesContext';

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

                const ids = wallets.map(wallet => wallet.crypto_id);

                if (prices.length === 0) await fetchPrices(ids);

                if (cryptocurrencies.length === 0) await fetchCryptocurrencies(ids);

                const latestPrices = ids.map(id => {
                    const cryptoPrices = prices[id];
                    if (!cryptoPrices || cryptoPrices.length === 0) return null;

                    const latestPrice = cryptoPrices.reduce((latest, current) => {
                        return new Date(latest.timestamp) > new Date(current.timestamp) ? latest : current;
                    }, cryptoPrices[0]);

                    const price24hAgo = cryptoPrices.reduce((closest, current) => {
                        const currentTime = new Date(current.timestamp);
                        const closestTime = new Date(closest.timestamp);
                        const latestTime = new Date(latestPrice.timestamp);

                        // Calcular a diferença de tempo em relação a 24 horas atrás
                        const targetTime = new Date(latestTime.getTime() - 24 * 60 * 60 * 1000);
                        const timeDiffCurrent = Math.abs(currentTime - targetTime);
                        const timeDiffClosest = Math.abs(closestTime - targetTime);

                        // Verificar se o item atual está no intervalo de 24 horas atrás
                        const isCurrentValid = currentTime <= latestTime && currentTime >= targetTime;
                        const isClosestValid = closestTime <= latestTime && closestTime >= targetTime;

                        // Atualizar o mais próximo com base na validade e na diferença de tempo
                        if (isCurrentValid && (!isClosestValid || timeDiffCurrent < timeDiffClosest)) {
                            return current;
                        }

                        return closest;
                    }, cryptoPrices[0]);

                    let priceChange24h = 0;
                    if (price24hAgo && price24hAgo.price_usd !== 0) {
                        priceChange24h = ((latestPrice.price_usd - price24hAgo.price_usd) / price24hAgo.price_usd) * 100;
                    }

                    return {
                        ...latestPrice,
                        priceChange24h,
                        allPrices: cryptoPrices // Include all prices for the crypto
                    };
                }).filter(price => price !== null);
                let totalValueUSD = 0;
                const cryptoItems = [];

                wallets.forEach(balance => {
                    const crypto = cryptocurrencies.find(c => c.id === balance.crypto_id);
                    const price = latestPrices.find(p => p?.crypto_id === balance.crypto_id);

                    if (crypto && price) {
                        const balanceValueUSD = balance.balance * price.price_usd;
                        totalValueUSD += balanceValueUSD;

                        cryptoItems.push({
                            name: crypto.name,
                            symbol: crypto.symbol,
                            balance: balance.balance,
                            value: balanceValueUSD.toFixed(2),
                            priceUSD: price.price_usd,
                            icon: crypto.icon,
                            variation: price.priceChange24h.toFixed(2),
                            latestPrices: price.allPrices // Pass all prices for the crypto
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