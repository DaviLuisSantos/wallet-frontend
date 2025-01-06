import apiClient from "./apiClient";

export const getPricesId = async (ids, startTime, endTime) => {
    const idsString = ids.join(',');
    const response = await apiClient.get(`/api/Price/${encodeURIComponent(idsString)}/${encodeURIComponent(startTime)}/${encodeURIComponent(endTime)}`);
    return response.data;
};

export const getPriceIds = async (ids) => {
    const queryString = ids.map(id => `ids=${id}`).join('&');
    const response = await apiClient.get(`/api/Price?${queryString}`);
    return response.data;
};