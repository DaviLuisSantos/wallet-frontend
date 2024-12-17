import React, { useState, useEffect } from 'react';
import CryptoList from '../components/CryptoList';
import Chart from '../components/Chart';

const Wallet = () => {
    const [cryptoItems, setCryptoItems] = useState([]);
    const [totalValueUSD, setTotalValueUSD] = useState(0);

    useEffect(() => {
        const fetchCryptoItems = async () => {
            try {
                const response1 = await fetch('http://localhost:3001/wallet/');
                const balances = await response1.json();

                const ids = balances.map(balance => balance.crypto_id);

                const response2 = await fetch('http://localhost:3001/crypto/manyy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids }),
                });
                const cryptoNames = await response2.json();

                const response3 = await fetch('http://localhost:3001/price/manyy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids }),
                });
                const prices = await response3.json();

                let totalValueUSD = 0;
                const cryptoItems = [];

                balances.forEach(balance => {
                    const crypto = cryptoNames.find(c => c.id === balance.crypto_id);
                    const price = prices.find(p => p.crypto_id === balance.crypto_id);
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
                });

                setCryptoItems(cryptoItems);
                setTotalValueUSD(totalValueUSD.toFixed(2));
            } catch (error) {
                console.error('Error fetching crypto items:', error);
            }
        };

        fetchCryptoItems();
    }, []);

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