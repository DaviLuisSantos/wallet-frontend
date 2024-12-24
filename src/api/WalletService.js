import apiClient from "./apiClient";

export const getWallet = async () => {
    const response = await apiClient.get('/wallet/');
    return response.data;
};