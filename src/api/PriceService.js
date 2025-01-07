import apiClient from "./apiClient";

export const getPricesId = async (ids, startTime, endTime) => {
    const idsString = ids.map(id => `ids=${id}`).join('&');
    const response = await apiClient.get(`/api/Price/filter?${idsString}&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`);
    return response.data;
};

export const getPriceIds = async (ids) => {
    const queryString = ids.map(id => `ids=${id}`).join('&');
    const response = await apiClient.get(`/api/Price/byids?${queryString}`);
    return response.data;
};