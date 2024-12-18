import React from 'react';
import ChartComponent from '../components/Chart';

const lineChartData = [
  ['Month', 'Value'],
  ['January', 65],
  ['February', 59],
  ['March', 80],
  ['April', 81],
  ['May', 56],
  ['June', 55],
  ['July', 40],
];

const lineChartOptions = {
  title: 'Portfolio Value Over Time',
  hAxis: { title: 'Month' },
  vAxis: { title: 'Value' },
  legend: 'none',
  backgroundColor: '#222531',
};

const pieChartData = [
  ['Asset', 'Value'],
  ['Bitcoin', 300],
  ['Ethereum', 50],
  ['Ripple', 100],
];

const pieChartOptions = {
  title: 'Portfolio Distribution',
  backgroundColor: '#222531',
};

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="bg-#222531 shadow-custom rounded-lg p-6 h-full">
          <div className="h-full">
            <ChartComponent type="line" data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
        <div className="bg-#222531 shadow-custom rounded-lg p-6 h-full">
          <div className="h-full">
            <ChartComponent type="pie" data={pieChartData} options={pieChartOptions} />
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