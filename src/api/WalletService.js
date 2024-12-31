import apiClient from "./apiClient";

export const getWallet = async () => {
    const response = await apiClient.get('/api/wallet/');
    return response.data;
};