export const fetchData = async (wallets, prices, latestPrices, cryptocurrencies, fetchWallets, fetchPrices, fetchLatestPrices, fetchCryptocurrencies) => {
    if (wallets.length === 0) await fetchWallets();

    const ids = wallets.map(wallet => wallet.cryptoId);

    const endTime = new Date().toISOString().split('T')[0];
    const startTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (Object.keys(prices).length === 0) {
        await fetchPrices(ids, oneDayAgo, endTime);
        await fetchPrices(ids, startTime, endTime);
    }
    if (latestPrices.length === 0) await fetchLatestPrices(ids);

    //if (cryptocurrencies.length === 0) await fetchCryptocurrencies(ids);
    return true;
};