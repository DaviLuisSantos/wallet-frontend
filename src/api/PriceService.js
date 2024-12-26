import apiClient from "./apiClient";

export const getPricesId = async (ids) => {
    const response = await apiClient.post('/price/manyy', { ids });
    return response.data;
};