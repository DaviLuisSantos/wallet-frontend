import React from 'react';
import ChartComponent from '../components/Chart';

const lineData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Line Dataset',
      data: [100, 200, 300, 400, 500, 600],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.4,
    },
  ],
};

const barData = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: 'Bar Dataset',
      data: [12, 19, 3, 5, 2, 3],
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
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
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
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="bg-#222531 shadow-custom rounded-lg p-6 h-full">
          <div className="h-full">
            <ChartComponent type="line" data={lineData} options={options} />
          </div>
        </div>
        <div className="bg-#222531 shadow-custom rounded-lg p-6 h-full">
          <div className="h-full">
            <ChartComponent type="bar" data={barData} options={options} />
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