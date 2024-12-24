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

                //const balances = await fetchWallets();
                await fetchWallets();

                const ids = wallets.map(balance => balance.crypto_id);

                // Receba os dados diretamente
                await fetchCryptocurrencies(ids);

                await fetchPrices(ids);

                const latestPrices = ids.map(id => {
                    const cryptoPrices = prices.filter(price => price?.crypto_id === id);
                    return cryptoPrices.reduce((latest, current) => {
                        return new Date(latest.timestamp) > new Date(current.timestamp) ? latest : current;
                    }, cryptoPrices[0]);
                });

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
    }, [cryptocurrencies, wallets, prices]); // Nenhuma dependência necessária aqui


    return (
        <div className="flex flex-col gap-4 items-center min-h-screen">
            <div className="flex flex-col w-full h-screen rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold mb-4 text-center text-teal-400">My Crypto Wallet</h1>

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