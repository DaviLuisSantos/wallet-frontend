import React from 'react';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, PointElement, LineElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, PointElement, LineElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Chart = ({ type, data, options }) => {
    switch (type) {
        case 'line':
            return <Line data={data} options={options} />;
        case 'bar':
            return <Bar data={data} options={options} />;
        case 'pie':
        default:
            return <Pie data={data} options={options} />;
    }
};

export default Chart;