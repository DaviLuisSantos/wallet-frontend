import React, { useState, useEffect } from 'react';
import ChartComponent from '../components/Chart';
import { useCryptocurrencies } from '../context/CryptocurrenciesContext';
import { useWallets } from '../context/WalletContext';
import { usePrices } from '../context/PricesContext';

const lineData24h = {
    labels: ['0h', '4h', '8h', '12h', '16h', '20h', '24h'],
    datasets: [
        {
            label: '24h Dataset',
            data: [100, 150, 120, 180, 140, 160, 130],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0,
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

                const ids = wallets.map(wallet => wallet.crypto_id);

                await fetchCryptocurrencies(ids);

                await fetchPrices(ids);

                if (wallets && prices && cryptocurrencies) {
                    const labels = [];
                    const data = [];
                    const backgroundColor = [];
                    const borderColor = [];

                    const colors = [
                        'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)',
                    ];

                    const borderColors = colors.map((c) => c.replace('0.2', '1'));

                    // Process wallet data
                    let colorIndex = 0;

                    Object.entries(wallets).forEach(([walletCryptoId, walletData]) => {
                        const crypto = cryptocurrencies.find(c => c.id === walletCryptoId);
                        const price = prices[crypto.id]; // Ou `crypto.id`, se as chaves de `prices` forem os IDs
                        if (crypto && price) {
                            const value = walletData.balance * price;
                            labels.push(crypto.name); // Ou `crypto.symbol`, dependendo da preferência
                            data.push(value);
                            backgroundColor.push(colors[colorIndex % colors.length]);
                            borderColor.push(borderColors[colorIndex % borderColors.length]);
                            colorIndex++;
                        }
                    });

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
                }

            }
            catch (error) {
                console.error('Erro ao buscar dados do dashboard:', error);
            }
        };

        fetchDashboard();

    }, [wallets, prices, cryptocurrencies]); // Garante que o gráfico será atualizado quando alguma dessas dependências mudar


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
                <p className="text-4xl font-bold">$10,000</p>
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
                <div className="bg-gradient-to-t from-gray-100 to-gray-500 shadow-custom rounded-lg p-4">
                    <h2 className="text-xl font-bold">Total Balance</h2>
                    <p className="text-gray-700">$10,000</p>
                </div>
                <div className="bg-gradient-to-t from-gray-100 to-gray-500 shadow-custom rounded-lg p-4">
                    <h2 className="text-xl font-bold">Recent Transactions</h2>
                    <p className="text-gray-700">Transaction details...</p>
                </div>
                <div className="bg-gradient-to-t from-gray-100 to-gray-500 shadow-custom rounded-lg p-4">
                    <h2 className="text-xl font-bold">Market Trends</h2>
                    <p className="text-gray-700">Market trends details...</p>
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