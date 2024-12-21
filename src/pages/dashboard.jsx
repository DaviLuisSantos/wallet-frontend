import React, { useState } from 'react';
import ChartComponent from '../components/Chart';

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

const donutData = {
    labels: ['Bitcoin', 'Ethereum', 'Ripple', 'Litecoin', 'Cardano', 'Polkadot'],
    datasets: [
        {
            label: 'Cryptocurrency Distribution',
            data: [40, 25, 15, 10, 5, 5],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],

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
                        <ChartComponent type="doughnut" data={donutData} options={options} />
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