import React, { useState, useEffect } from 'react';
import CryptoLineChart from '../components/CryptoLineChart';
import ChartComponent from '../components/Chart';
import CryptoCard from '../components/CryptoCard';
import { useCryptocurrencies } from '../context/CryptocurrenciesContext';
import { useWallets } from '../context/WalletContext';
import { usePrices } from '../context/PricesContext';
import { calculatePriceChange, findTopGainer, findTopLoser } from '../utils/priceUtils';
import { symbol } from 'prop-types';

const Dashboard = () => {
    const { cryptocurrencies, fetchCryptocurrencies } = useCryptocurrencies();
    const { wallets, fetchWallets } = useWallets();
    const { prices, fetchPrices } = usePrices();
    const [totalValueUSD, setTotalValueUSD] = useState(0);
    const [topGainer, setTopGainer] = useState(null);
    const [topLoser, setTopLoser] = useState(null);
    const [selectedRange, setSelectedRange] = useState('all');
    const [aggregatedPrices, setAggregatedPrices] = useState([]);
    const [top3Cryptos, setTop3Cryptos] = useState([]);

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
                await fetchWallets();
                const ids = wallets.map(wallet => wallet.cryptoId);
                const endTime = new Date().toISOString().split('T')[0]; // Formato yyyy-mm-dd
                const startTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Formato yyyy-mm-dd
                const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Formato yyyy-mm-dd

                if (Object.keys(prices).length === 0) {
                    await fetchPrices(ids, oneDayAgo, endTime);
                    await fetchPrices(ids, startTime, endTime);
                }

                await fetchCryptocurrencies(ids);

                if (wallets.length > 0 && Object.keys(prices).length > 0 && cryptocurrencies.length > 0) {
                    const labels = [];
                    const data = [];
                    const backgroundColor = [];
                    const borderColor = [];

                    const colors = [
                        'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)',
                        'rgba(201, 203, 207, 0.2)', 'rgba(255, 99, 132, 0.2)',
                    ];

                    const borderColors = colors.map((c) => c.replace('0.2', '1'));

                    let colorIndex = 0;

                    // Calculate the value of each wallet item
                    const walletValues = wallets.map(wallet => {
                        const crypto = cryptocurrencies.find(c => c.id === wallet.cryptoId);
                        const price = prices[wallet.cryptoId]?.[0]; // Get the latest price
                        if (crypto && price) {
                            const value = wallet.amount * price.priceUsd;
                            return { ...wallet, value, crypto, price };
                        }
                        return null;
                    }).filter(item => item !== null);

                    // Sort by value in descending order
                    walletValues.sort((a, b) => b.value - a.value);

                    // Calculate the total value
                    const totalValue = walletValues.reduce((sum, item) => sum + item.value, 0);

                    // Take the top 6 and group the rest as "Others"
                    const top6 = walletValues.slice(0, 6);
                    const others = walletValues.slice(6);

                    top6.forEach(item => {
                        labels.push(item.crypto.name);
                        data.push((item.value / totalValue * 100).toFixed(2)); // Convert to percentage
                        backgroundColor.push(colors[colorIndex % colors.length]);
                        borderColor.push(borderColors[colorIndex % borderColors.length]);
                        colorIndex++;
                    });

                    if (others.length > 0) {
                        const othersValue = others.reduce((sum, item) => sum + item.value, 0);
                        labels.push('Others');
                        data.push((othersValue / totalValue * 100).toFixed(2)); // Convert to percentage
                        backgroundColor.push(colors[colorIndex % colors.length]);
                        borderColor.push(borderColors[colorIndex % borderColors.length]);
                    }

                    setDonutData({
                        labels,
                        datasets: [
                            {
                                label: 'Cryptocurrency Distribution',
                                data,
                                backgroundColor,
                                borderColor,
                            },
                        ],
                    });

                    const latestPrices = ids.map(id => {
                        const cryptoPrices = prices[id];
                        if (!cryptoPrices || cryptoPrices.length === 0) return null;

                        return calculatePriceChange(cryptoPrices);
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

                    console.log('Donut chart data:', {
                        labels,
                        datasets: [
                            {
                                label: 'Cryptocurrency Distribution',
                                data,
                                backgroundColor,
                                borderColor,
                            },
                        ],
                    });
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
                        <p className="text-sm text-orange-400 flex items-center">
                            -2.5% <span className="ml-1 text-xl">&#8595;</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-sm text-gray-400">7 Days</h3>
                        <p className="text-sm text-green-400 flex items-center">
                            +4.25% <span className="ml-1 text-xl">&#8593;</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-sm text-gray-400">30 Days</h3>
                        <p className="text-sm text-green-400 flex items-center">
                            +11.5% <span className="ml-1 text-xl">&#8593;</span>
                        </p>
                    </div>
                </div>
            </div>



            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                {top3Cryptos.map((crypto, index) => (
                    <div key={index}>
                        <CryptoCard
                            icon={crypto.icon}
                            name={crypto.name}
                            symbol={crypto.symbol}
                            variation={crypto.priceChange24h}
                            lastValue={crypto.lastValue}
                            sparklineData={crypto.sparklineData}
                        />
                    </div>
                ))}

                <div >
                    {topLoser && (
                        <CryptoCard
                            icon={topLoser.icon}
                            name={topLoser.name}
                            symbol={topLoser.symbol}
                            variation={topLoser.priceChange24h}
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

            <div className="mt-4">
                <div className="bg-gradient-to-t from-gray-100 to-gray-500 shadow-custom rounded-lg p-4">
                    <h2 className="text-xl font-bold">Portfolio Overview</h2>
                    <p className="text-gray-700">Portfolio details...</p>
                    <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">View More</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;