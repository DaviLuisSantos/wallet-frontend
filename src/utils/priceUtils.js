/**
 * Calcula a variação de preço em um período especificado para uma criptomoeda.
 * @param {Array} cryptoPrices - Lista de preços da criptomoeda.
 * @param {number} [hours=24] - Período em horas para calcular a variação de preço. (Padrão: 24 horas)
 * @returns {Object|null} Retorna o preço mais recente, variação no período e todos os preços, ou null se não houver dados.
 */
export const calculatePriceChange = (precos, hours = 24) => {
    const cryptoPrices = precos;
    if (!cryptoPrices || cryptoPrices.length === 0) return null;

    const latestPrice = cryptoPrices.reduce((latest, current) => {
        return new Date(latest.timestamp) > new Date(current.timestamp) ? latest : current;
    }, cryptoPrices[0]);

    const priceAgo = cryptoPrices.reduce((closest, current) => {
        const currentTime = new Date(current.timestamp);
        const closestTime = new Date(closest.timestamp);
        const latestTime = new Date(latestPrice.timestamp);

        const targetTime = new Date(latestTime.getTime() - hours * 60 * 60 * 1000);
        const timeDiffCurrent = Math.abs(currentTime - targetTime);
        const timeDiffClosest = Math.abs(closestTime - targetTime);

        const isCurrentValid = currentTime <= latestTime && currentTime >= targetTime;
        const isClosestValid = closestTime <= latestTime && closestTime >= targetTime;

        if (isCurrentValid && (!isClosestValid || timeDiffCurrent < timeDiffClosest)) {
            return current;
        }

        return closest;
    }, cryptoPrices[0]);

    let priceChange = 0;
    if (priceAgo && priceAgo.priceUsd !== 0) {
        priceChange = ((latestPrice.priceUsd - priceAgo.priceUsd) / priceAgo.priceUsd) * 100;
    }

    return {
        ...latestPrice,
        priceChange,
        allPrices: cryptoPrices,
    };
};

export const calculateWalletValues = (wallets, cryptocurrencies, prices) => {
    // Calculate the value of each wallet item
    const walletValues = wallets.map(wallet => {
        const crypto = cryptocurrencies.find(c => c.id === wallet.cryptoId);
        const price = prices[wallet.cryptoId]?.[0]; // Get the latest price
        if (crypto && price) {
            const value = wallet.amount * price.priceUsd;
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

    return { walletValues, totalValue, top6, others };
};

// topCryptoUtils.js
export const findTopGainer = (prices) => {
    return prices.reduce((max, price) =>
        price.priceChange > max.priceChange ? price : max, prices[0]);
};

export const findTopLoser = (prices) => {
    return prices.reduce((min, price) =>
        price.priceChange < min.priceChange ? price : min, prices[0]);
};
