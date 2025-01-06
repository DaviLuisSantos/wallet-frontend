import React from 'react';
import PropTypes from 'prop-types';
import ChartComponent from './Chart';

const CryptoLineChart = ({ name, latestPrices, selectedRange }) => {
    console.log(latestPrices);

    const filterAndGroupPricesByRange = (range) => {
        const now = new Date();
        let filteredPrices;

        switch (range) {
            case '24h': {
                filteredPrices = latestPrices.filter(price => {
                    const priceTime = new Date(price.timestamp);
                    return now - priceTime <= 24 * 60 * 60 * 1000; // Últimas 24 horas
                });

                // Agrupar por hora
                return filteredPrices.reduce((acc, price) => {
                    const hour = new Date(price.timestamp).getHours();
                    if (!acc[hour]) {
                        acc[hour] = { ...price, count: 1 };
                    } else {
                        acc[hour].priceUsd += price.priceUsd;
                        acc[hour].count += 1;
                    }
                    return acc;
                }, {});
            }
            case '7d':
            case '30d': {
                filteredPrices = latestPrices.filter(price => {
                    const priceTime = new Date(price.timestamp);
                    const days = range === '7d' ? 7 : 30;
                    return now - priceTime <= days * 24 * 60 * 60 * 1000;
                });

                // Agrupar por dia
                return filteredPrices.reduce((acc, price) => {
                    const day = new Date(price.timestamp).toDateString();
                    if (!acc[day]) {
                        acc[day] = { ...price, count: 1 };
                    } else {
                        acc[day].priceUsd += price.priceUsd;
                        acc[day].count += 1;
                    }
                    return acc;
                }, {});
            }
            default:
                return latestPrices;
        }
    };

    const groupedPrices = filterAndGroupPricesByRange(selectedRange);
    const sortedPrices = Object.values(groupedPrices)
        .map(price => ({ ...price, priceUsd: price.priceUsd / price.count })) // Média por agrupamento
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const formatLabel = (timestamp) => {
        const date = new Date(timestamp);
        return selectedRange === '24h'
            ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // Formato HH:mm
            : date.toLocaleDateString('pt-BR'); // Formato dd/mm/yyyy
    };

    const chartData = {
        labels: sortedPrices.map(price => formatLabel(price.timestamp)),
        datasets: [
            {
                label: `${name} Price (USD)`,
                data: sortedPrices.map(price => price.priceUsd),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.2,
                borderWidth: 2,
            },
        ],
    };

    // Cálculo dos níveis de Fibonacci
    const prices = sortedPrices.map(price => price.priceUsd);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const diff = maxPrice - minPrice;
    const fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1].map(level => maxPrice - diff * level);

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
            annotation: {
                annotations: fibLevels.map((level, index) => {
                    const colors = ['rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 0.5)', 'rgba(255, 0, 0, 0.5)'];
                    return {
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y',
                        value: level,
                        borderColor: index === 3 ? colors[1] : index < 3 ? colors[0] : colors[2],
                        borderWidth: 1,
                        label: {
                            content: `Fib ${index}`,
                            enabled: true,
                            position: 'right',
                        },
                    };
                }),
            },
            zoom: {
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
        priceUsd: PropTypes.number.isRequired,
    })).isRequired,
    selectedRange: PropTypes.string.isRequired,
};

export default CryptoLineChart;