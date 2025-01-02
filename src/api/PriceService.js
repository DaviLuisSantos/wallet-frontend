import apiClient from "./apiClient";

export const getPricesId = async (ids, startTime, endTime) => {
    const idsString = ids.join(',');
    const response = await apiClient.get(`/api/Price/${encodeURIComponent(idsString)}/${encodeURIComponent(startTime)}/${encodeURIComponent(endTime)}`);
    return response.data;
};