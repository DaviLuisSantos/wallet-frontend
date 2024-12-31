import apiClient from "./apiClient";

export const getPricesId = async (ids) => {
    const queryString = ids.map(id => `ids=${id}`).join(',');
    const response = await apiClient.get(`/api/Price?${queryString}`);
    return response.data;
};