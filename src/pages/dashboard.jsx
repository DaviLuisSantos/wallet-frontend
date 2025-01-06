import React, { useState, useEffect } from 'react';
import CryptoLineChart from '../components/CryptoLineChart';
import ChartComponent from '../components/Chart';
import CryptoCard from '../components/CryptoCard';
import { useCryptocurrencies } from '../context/CryptocurrenciesContext';
import { useWallets } from '../context/WalletContext';
import { usePrices } from '../context/PricesContext';
import { calculatePriceChange, findTopGainer, findTopLoser, calculateWalletValues } from '../utils/priceUtils';
import { fetchData } from '../utils/fetchData';
import { generateChartData } from '../utils/chartUtils';

const Dashboard = () => {
    const { cryptocurrencies, fetchCryptocurrencies } = useCryptocurrencies();
    const { wallets, fetchWallets } = useWallets();
    const { prices, fetchPrices, latestPrices, fetchLatestPrices } = usePrices();
    const [totalValueUSD, setTotalValueUSD] = useState(0);
    const [topGainer, setTopGainer] = useState(null);
    const [topLoser, setTopLoser] = useState(null);
    const [selectedRange, setSelectedRange] = useState('all');
    const [aggregatedPrices, setAggregatedPrices] = useState([]);
    const [top3Cryptos, setTop3Cryptos] = useState([]);
    const [variations, setVariation24h] = useState({ variation24h: 0, variation7d: 0, variation30d: 0 });

    const [donutData, setDonutData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Cryptocurrency Distribution',
                data: [],
                backgroundColor: [],
                borderColor: [],
            },
        ],
    });

    useEffect(() => {
        const fetchDashboard = async () => {
            try {

                await fetchData(wallets, prices, latestPrices, cryptocurrencies, fetchWallets, fetchPrices, fetchLatestPrices, fetchCryptocurrencies);

                let colorIndex = 0;
                if (!wallets || !prices || !cryptocurrencies) return;
                const { walletValues, totalValue, top6, others } = calculateWalletValues(wallets, cryptocurrencies, prices);

                if (wallets.length > 0 && Object.keys(prices).length > 0 && cryptocurrencies.length > 0) {

                    setDonutData(generateChartData(wallets, prices, cryptocurrencies, top6, others, totalValue));

                    const ids = wallets.map(wallet => wallet.cryptoId);

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

                        let priceChange = 0;
                        if (price24hAgo && price24hAgo.priceUsd !== 0) {
                            priceChange = ((latestPrice.priceUsd - price24hAgo.priceUsd) / price24hAgo.priceUsd) * 100;
                        }

                        return {
                            ...latestPrice,
                            priceChange,
                            allPrices: cryptoPrices // Include all prices for the crypto
                        };
                    }).filter(price => price !== null);

                    let accumulatedValueUSD = 0;

                    wallets.forEach(balance => {
                        const crypto = cryptocurrencies.find(c => c.id === balance.cryptoId);
                        const price = latestPrices.find(p => p?.cryptoId === balance.cryptoId);

                        if (crypto && price) {
                            const balanceValueUSD = balance.amount * price.priceUsd;
                            accumulatedValueUSD += balanceValueUSD;
                        }
                    });

                    setTotalValueUSD(accumulatedValueUSD.toFixed(2));

                    const top3 = walletValues.slice(0, 3);
                    const top3Ids = top3.map(item => item.crypto.id);

                    const latestPricesTop3 = top3Ids.map(id => {
                        const cryptoPrices = prices[id];
                        if (!cryptoPrices || cryptoPrices.length === 0) return null;

                        // Filtrar preços das últimas 24 horas
                        const now = new Date();
                        const startOfDayYesterday = new Date(now);
                        startOfDayYesterday.setDate(now.getDate() - 1);
                        //startOfDayYesterday.setHours(0, 0, 0, 0);

                        const pricesLast24h = cryptoPrices.filter(p => {
                            const priceTime = new Date(p.timestamp);
                            return priceTime >= startOfDayYesterday && priceTime <= now;
                        });

                        // Agrupar por hora e pegar o último preço de cada hora
                        const pricesByHour = pricesLast24h.reduce((acc, price) => {
                            const hour = new Date(price.timestamp).getHours();
                            acc[hour] = price;
                            return acc;
                        }, {});

                        const hourlyPrices = Object.values(pricesByHour);

                        return calculatePriceChange(hourlyPrices);
                    }).filter(price => price !== null);

                    const top3Cryptos = latestPricesTop3.map(price => {
                        const crypto = cryptocurrencies.find(c => c.id === price.cryptoId);
                        return {
                            ...price,
                            cryptoId: crypto?.id,
                            name: crypto?.name,
                            symbol: crypto?.symbol,
                            icon: crypto?.icon,
                            sparklineData: price.allPrices.map(p => p.priceUsd),
                            lastValue: price.priceUsd,
                        };
                    });

                    setTop3Cryptos(top3Cryptos);


                    // Use the functions to find the top gainer and top loser
                    const topGainer = findTopGainer(latestPrices);
                    const topLoser = findTopLoser(latestPrices);

                    const topGainerCrypto = cryptocurrencies.find(c => c.id === topGainer.cryptoId);
                    const topLoserCrypto = cryptocurrencies.find(c => c.id === topLoser.cryptoId);

                    setTopGainer({
                        ...topGainer,
                        name: topGainerCrypto?.name,
                        icon: topGainerCrypto?.icon,
                        sparklineData: topGainer.allPrices.map(p => p.priceUsd),
                        lastValue: topGainer.priceUsd,
                    });

                    setTopLoser({
                        ...topLoser,
                        name: topLoserCrypto?.name,
                        symbol: topLoserCrypto?.symbol,
                        icon: topLoserCrypto?.icon,
                        priceChange: topLoser.priceChange,
                        sparklineData: topLoser.allPrices.map(p => p.priceUsd),
                        lastValue: topLoser.priceUsd,
                    });

                    // Aggregate prices over time
                    const aggregatedPrices = [];
                    const priceMap = {};

                    latestPrices.forEach(price => {
                        price.allPrices.forEach(p => {
                            const timestamp = new Date(p.timestamp).toISOString();
                            if (!priceMap[timestamp]) {
                                priceMap[timestamp] = 0;
                            }
                            priceMap[timestamp] += p.priceUsd;
                        });
                    });

                    for (const [timestamp, priceUsd] of Object.entries(priceMap)) {
                        const totalValue = wallets.reduce((sum, wallet) => {
                            const cryptoPrices = prices[wallet.cryptoId];
                            if (!cryptoPrices) return sum;

                            const priceAtTimestamp = cryptoPrices.find(p => new Date(p.timestamp).toISOString() === timestamp);
                            if (!priceAtTimestamp) return sum;

                            return sum + (priceAtTimestamp.priceUsd * wallet.amount);
                        }, 0);

                        aggregatedPrices.push({ timestamp, priceUsd: totalValue });
                    }

                    setAggregatedPrices(aggregatedPrices);

                    const variation24h = calculatePriceChange(aggregatedPrices, 24);
                    const variation7d = calculatePriceChange(aggregatedPrices, 24 * 7);
                    const variation30d = calculatePriceChange(aggregatedPrices, 24 * 30);

                    setVariation24h({ variation24h, variation7d, variation30d });

                    console.log(variations);

                } else {
                    console.log('Missing data for donut chart:', { wallets, prices, cryptocurrencies });
                }
            } catch (error) {
                console.error('Erro ao buscar dados do dashboard:', error);
            }
        };

        fetchDashboard();
    }, [wallets, cryptocurrencies, fetchWallets, fetchCryptocurrencies, fetchPrices]);

    const donutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Cryptocurrency Distribution',
            },
        },
    };

    return (
        <div className="container mx-auto p-4">
            <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg w-full flex justify-between items-center">
                {/* Left Section: Total Balance */}
                <div>
                    <h2 className="text-sm text-gray-400 uppercase">Total Balance</h2>
                    <p className="text-4xl font-bold">
                        ${String(totalValueUSD).split('.')[0]}
                        <span className="text-2xl align-middle ">.{String(totalValueUSD).split('.')[1]}</span>
                    </p>
                </div>

                {/* Right Section: Variations */}
                <div className="flex space-x-8">
                    <div className="text-right">
                        <h3 className="text-sm text-gray-400">Today</h3>
                        <p className={`text-sm flex items-center ${variations.variation24h.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {variations.variation24h.priceChange?.toFixed(2)}% <span className="ml-1 text-xl">{variations.variation24h.priceChange >= 0 ? '↑' : '↓'}</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-sm text-gray-400">7 Days</h3>
                        <p className={`text-sm flex items-center ${variations.variation7d.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {variations.variation7d.priceChange?.toFixed(2)}% <span className="ml-1 text-xl">{variations.variation7d.priceChange >= 0 ? '↑' : '↓'}</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-sm text-gray-400">30 Days</h3>
                        <p className={`text-sm flex items-center ${variations.variation30d.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {variations.variation30d.priceChange?.toFixed(2)}% <span className="ml-1 text-xl">{variations.variation30d.priceChange >= 0 ? '↑' : '↓'}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                {top3Cryptos.map((crypto, index) => (
                    <div key={index}>
                        <CryptoCard
                            cryptoId={crypto.cryptoId}
                            icon={crypto.icon}
                            name={crypto.name}
                            symbol={crypto.symbol}
                            variation={crypto.priceChange}
                            lastValue={crypto.lastValue}
                            sparklineData={crypto.sparklineData}
                        />
                    </div>
                ))}

                <div>
                    {topLoser && (
                        <CryptoCard
                            icon={topLoser.icon}
                            name={topLoser.name}
                            symbol={topLoser.symbol}
                            variation={topLoser.priceChange}
                            lastValue={topLoser.lastValue}
                            sparklineData={topLoser.sparklineData}
                        />
                    )}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                <div className="bg-#222531 shadow-custom rounded-lg p-6 h-full" style={{ height: '400px' }}>
                    <div className="flex justify-end space-x-2 mb-4">
                        <button
                            onClick={() => setSelectedRange('24h')}
                            className={`px-4 py-2 rounded ${selectedRange === '24h' ? 'bg-gray-800 text-white' : 'bg-gray-600 text-gray-300'}`}
                        >
                            24h
                        </button>
                        <button
                            onClick={() => setSelectedRange('7d')}
                            className={`px-4 py-2 rounded ${selectedRange === '7d' ? 'bg-gray-800 text-white' : 'bg-gray-600 text-gray-300'}`}
                        >
                            7d
                        </button>
                        <button
                            onClick={() => setSelectedRange('30d')}
                            className={`px-4 py-2 rounded ${selectedRange === '30d' ? 'bg-gray-800 text-white' : 'bg-gray-600 text-gray-300'}`}
                        >
                            30d
                        </button>
                        <button
                            onClick={() => setSelectedRange('all')}
                            className={`px-4 py-2 rounded ${selectedRange === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-600 text-gray-300'}`}
                        >
                            All
                        </button>
                    </div>
                    <div className="h-full">
                        <CryptoLineChart name="Total Value" latestPrices={aggregatedPrices} selectedRange={selectedRange} />
                    </div>
                </div>
                <div className="bg-#222531 shadow-custom rounded-lg p-6 h-full" style={{ height: '400px' }}>
                    <div className="h-full">
                        <ChartComponent type="doughnut" data={donutData} options={donutOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;