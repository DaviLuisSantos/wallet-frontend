import React from 'react';
import PropTypes from 'prop-types';
import ChartComponent from './Chart';

const CryptoLineChart = ({ name, latestPrices, selectedRange }) => {
    const filterAndGroupPricesByRange = (range) => {
        const now = new Date();
        let filteredPrices;
        switch (range) {
            case '24h':
                filteredPrices = latestPrices.filter(price => {
                    const priceTime = new Date(price.timestamp);
                    return (now - priceTime) <= 24 * 60 * 60 * 1000;
                });
                // Agrupar por hora
                return filteredPrices.reduce((acc, price) => {
                    const hour = new Date(price.timestamp).getHours();
                    acc[hour] = price;
                    return acc;
                }, {});
            case '7d':
            case '30d':
                filteredPrices = latestPrices.filter(price => {
                    const priceTime = new Date(price.timestamp);
                    return (now - priceTime) <= (range === '7d' ? 7 : 30) * 24 * 60 * 60 * 1000;
                });
                // Agrupar por dia
                return filteredPrices.reduce((acc, price) => {
                    const day = new Date(price.timestamp).toDateString();
                    acc[day] = price;
                    return acc;
                }, {});
            default:
                return latestPrices;
        }
    };

    const groupedPrices = filterAndGroupPricesByRange(selectedRange);
    const sortedPrices = Object.values(groupedPrices).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const formatLabel = (timestamp) => {
        const date = new Date(timestamp);
        if (selectedRange === '24h') {
            return date.toTimeString().split(' ')[0]; // Formato hh:mm:ss
        } else {
            return date.toLocaleDateString('pt-BR'); // Formato dd/mm/yyyy
        }
    };

    const chartData = {
        labels: sortedPrices.map(price => formatLabel(price.timestamp)),
        datasets: [
            {
                label: `${name} Price (USD)`,
                data: sortedPrices.map(price => price.price_usd),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.2,
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `${name} Price Over Time`,
            },
            zoom: { // Adiciona suporte ao plugin de zoom
                pan: {
                    enabled: true,
                    mode: 'x',
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true,
                    },
                    mode: 'x',
                },
            },
        },
    };

    return <ChartComponent type="line" data={chartData} options={chartOptions} />;
};

CryptoLineChart.propTypes = {
    name: PropTypes.string.isRequired,
    latestPrices: PropTypes.arrayOf(PropTypes.shape({
        timestamp: PropTypes.string.isRequired,
        price_usd: PropTypes.number.isRequired,
    })).isRequired,
    selectedRange: PropTypes.string.isRequired,
};

export default CryptoLineChart;