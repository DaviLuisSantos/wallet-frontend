export const generateChartData = (wallets, prices, cryptocurrencies, top6, others, totalValue) => {
    if (wallets.length > 0 && Object.keys(prices).length > 0 && cryptocurrencies.length > 0) {
        const labels = [];
        const data = [];
        const backgroundColor = [];
        const borderColor = [];
        let colorIndex = 0;

        const colors = [
            'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)',
            'rgba(201, 203, 207, 0.2)', 'rgba(255, 99, 132, 0.2)',
        ];

        const borderColors = colors.map(c => c.replace('0.2', '1'));

        top6.forEach(item => {
            labels.push(item.crypto.name);
            data.push(((item.value / totalValue) * 100).toFixed(2)); // Convert to percentage
            backgroundColor.push(colors[colorIndex % colors.length]);
            borderColor.push(borderColors[colorIndex % borderColors.length]);
            colorIndex++;
        });

        if (others.length > 0) {
            const othersValue = others.reduce((sum, item) => sum + item.value, 0);
            labels.push('Others');
            data.push(((othersValue / totalValue) * 100).toFixed(2)); // Convert to percentage
            backgroundColor.push(colors[colorIndex % colors.length]);
            borderColor.push(borderColors[colorIndex % borderColors.length]);
        }

        return {
            labels,
            datasets: [
                {
                    label: 'Cryptocurrency Distribution',
                    data,
                    backgroundColor,
                    borderColor,
                },
            ],
        };
    }

    return null; // Return null if input conditions are not met
}
