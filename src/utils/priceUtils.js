// utils/calculatePriceChange.js

/**
 * Calcula a variação de preço em 24 horas para uma criptomoeda.
 * @param {Array} cryptoPrices - Lista de preços da criptomoeda.
 * @returns {Object|null} Retorna o preço mais recente, variação de 24h e todos os preços, ou null se não houver dados.
 */
export const calculatePriceChange = (cryptoPrices) => {
    if (!cryptoPrices || cryptoPrices.length === 0) return null;

    const latestPrice = cryptoPrices.reduce((latest, current) => {
        return new Date(latest.timestamp) > new Date(current.timestamp) ? latest : current;
    }, cryptoPrices[0]);

    const price24hAgo = cryptoPrices.reduce((closest, current) => {
        const currentTime = new Date(current.timestamp);
        const closestTime = new Date(closest.timestamp);
        const latestTime = new Date(latestPrice.timestamp);

        const targetTime = new Date(latestTime.getTime() - 24 * 60 * 60 * 1000);
        const timeDiffCurrent = Math.abs(currentTime - targetTime);
        const timeDiffClosest = Math.abs(closestTime - targetTime);

        const isCurrentValid = currentTime <= latestTime && currentTime >= targetTime;
        const isClosestValid = closestTime <= latestTime && closestTime >= targetTime;

        if (isCurrentValid && (!isClosestValid || timeDiffCurrent < timeDiffClosest)) {
            return current;
        }

        return closest;
    }, cryptoPrices[0]);

    let priceChange24h = 0;
    if (price24hAgo && price24hAgo.priceUsd !== 0) {
        priceChange24h = ((latestPrice.priceUsd - price24hAgo.priceUsd) / price24hAgo.priceUsd) * 100;
    }

    return {
        ...latestPrice,
        priceChange24h,
        allPrices: cryptoPrices,
    };
};

// topCryptoUtils.js
export const findTopGainer = (prices) => {
    return prices.reduce((max, price) => 
        price.priceChange24h > max.priceChange24h ? price : max, prices[0]);
};

export const findTopLoser = (prices) => {
    return prices.reduce((min, price) => 
        price.priceChange24h < min.priceChange24h ? price : min, prices[0]);
};
