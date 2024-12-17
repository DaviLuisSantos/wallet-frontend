import React from 'react';
import Chart from '../components/Chart';

const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)',
            data: [65, 59, 80, 81, 56, 55, 40],
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
            text: 'Chart.js Line Chart',
        },
    },
};

const HomePage = () => {
    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-4">My Chart</h1>
            <Chart type="pie"data={data} options={options} />
        </div>
    );
};

export default HomePage;