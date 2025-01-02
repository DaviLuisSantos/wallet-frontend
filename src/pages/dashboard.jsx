import React, { useState, useEffect } from 'react';
import ChartComponent from '../components/Chart';
import CryptoCard from '../components/CryptoCard';
import { useCryptocurrencies } from '../context/CryptocurrenciesContext';
import { useWallets } from '../context/WalletContext';
import { usePrices } from '../context/PricesContext';


const lineData24h = {
    labels: [
        '0h', '1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', '11h',
        '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h', '24h'
    ],
    datasets: [
        {
            label: '24h Dataset',
            data: [
                100, 95, 120, 110, 130, 115, 140, 125, 160, 150,
                130, 170, 180, 160, 190, 170, 200, 180, 210, 190,
                220, 200, 230, 210, 220
            ],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.2,
        },
    ],
};


const lineData7d = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            label: '7d Dataset',
            data: [200, 250, 220, 280, 240, 260, 230],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0,
        },
    ],
};

const lineData30d = {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    datasets: [
        {
            label: '30d Dataset',
            data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 200 + 100)),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0,
        },
    ],
};

const lineDataAll = {
    labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
        {
            label: 'All Dataset',
            data: [
                100, 150, 120, 180, 140, 160, 130, 170, 110, 190, 115, 175,
                105, 165, 125, 185, 135, 155, 145, 195, 140, 150, 130, 180
            ],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0,
        },
    ],
};

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Dynamic Chart Example',
        },
    },
};

const Dashboard = () => {
    const { cryptocurrencies, fetchCryptocurrencies } = useCryptocurrencies();
    const { wallets, fetchWallets } = useWallets();
    const { prices, fetchPrices } = usePrices();
    const [totalValueUSD, setTotalValueUSD] = useState(0);
    const [topGainer, setTopGainer] = useState(null);
    const [topLoser, setTopLoser] = useState(null);

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
                const ids = wallets.map(wallet => wallet.CryptoId);
                const endTime = new Date().toISOString().split('T')[0]; // Formato yyyy-mm-dd
                const startTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Formato yyyy-mm-dd

                await fetchPrices(ids, startTime, endTime);
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
                        const crypto = cryptocurrencies.find(c => c.id === wallet.CryptoId);
                        const price = prices[wallet.CryptoId]?.[0]; // Get the latest price
                        if (crypto && price) {
                            const value = wallet.balance * price.price_usd;
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

                    let accumulatedValueUSD = 0;

                    wallets.forEach(balance => {
                        const crypto = cryptocurrencies.find(c => c.id === balance.CryptoId);
                        const price = latestPrices.find(p => p?.CryptoId === balance.CryptoId);

                        if (crypto && price) {
                            const balanceValueUSD = balance.balance * price.price_usd;
                            accumulatedValueUSD += balanceValueUSD;
                        }
                    });

                    setTotalValueUSD(accumulatedValueUSD.toFixed(2));

                    // Find the top gainer and top loser
                    const topGainer = latestPrices.reduce((max, price) => price.priceChange24h > max.priceChange24h ? price : max, latestPrices[0]);
                    const topLoser = latestPrices.reduce((min, price) => price.priceChange24h < min.priceChange24h ? price : min, latestPrices[0]);

                    const topGainerCrypto = cryptocurrencies.find(c => c.id === topGainer.CryptoId);
                    const topLoserCrypto = cryptocurrencies.find(c => c.id === topLoser.CryptoId);

                    setTopGainer({
                        ...topGainer,
                        name: topGainerCrypto?.name,
                        icon: topGainerCrypto?.icon,
                    });

                    setTopLoser({
                        ...topLoser,
                        name: topLoserCrypto?.name,
                        icon: topLoserCrypto?.icon,
                    });

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

    const [selectedData, setSelectedData] = useState(lineDataAll);
    const [selectedRange, setSelectedRange] = useState('all');

    const handleTimeRangeChange = (range) => {
        setSelectedRange(range);
        switch (range) {
            case '24h':
                setSelectedData(lineData24h);
                break;
            case '7d':
                setSelectedData(lineData7d);
                break;
            case '30d':
                setSelectedData(lineData30d);
                break;
            case 'all':
            default:
                setSelectedData(lineDataAll);
                break;
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="shadow-custom rounded-lg p-6">
                <h2 className="text-xl text-gray-700">Total Balance</h2>
                <p className="text-4xl font-bold">{totalValueUSD}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                <div className="bg-#222531 shadow-custom rounded-lg p-6 h-full" style={{ height: '400px' }}>
                    <div className="flex justify-end space-x-2 mb-4">
                        <button
                            onClick={() => handleTimeRangeChange('24h')}
                            className={`px-4 py-2 rounded ${selectedRange === '24h' ? 'bg-gray-800 text-white' : 'bg-gray-600 text-gray-300'}`}
                        >
                            24h
                        </button>
                        <button
                            onClick={() => handleTimeRangeChange('7d')}
                            className={`px-4 py-2 rounded ${selectedRange === '7d' ? 'bg-gray-800 text-white' : 'bg-gray-600 text-gray-300'}`}
                        >
                            7d
                        </button>
                        <button
                            onClick={() => handleTimeRangeChange('30d')}
                            className={`px-4 py-2 rounded ${selectedRange === '30d' ? 'bg-gray-800 text-white' : 'bg-gray-600 text-gray-300'}`}
                        >
                            30d
                        </button>
                        <button
                            onClick={() => handleTimeRangeChange('all')}
                            className={`px-4 py-2 rounded ${selectedRange === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-600 text-gray-300'}`}
                        >
                            All
                        </button>
                    </div>
                    <div className="h-full">
                        <ChartComponent type="line" data={selectedData} options={options} />
                    </div>
                </div>
                <div className="bg-#222531 shadow-custom rounded-lg p-6 h-full" style={{ height: '400px' }}>
                    <div className="h-full">
                        <ChartComponent type="doughnut" data={donutData} options={donutOptions} />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="shadow-custom rounded-lg p-4">
                    {topGainer && (
                        <CryptoCard
                            icon={<img src={`data:image/png;base64, ${topGainer.icon}`} alt={`${topGainer.name} icon`} width={64} height={64} />}
                            variation={topGainer.priceChange24h}
                        />
                    )}
                </div>
                <div className="bg-gradient-to-t from-gray-100 to-gray-500 shadow-custom rounded-lg p-4">
                    <h2 className="text-xl font-bold">Recent Transactions</h2>
                    <p className="text-gray-700">Transaction details...</p>
                </div>
                <div className=" shadow-custom rounded-lg p-4">
                    {topLoser && (
                        <CryptoCard
                            icon={<img src={`data:image/png;base64, ${topLoser.icon}`} alt={`${topLoser.name} icon`} width={64} height={64} />}
                            variation={topLoser.priceChange24h}
                        />
                    )}
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