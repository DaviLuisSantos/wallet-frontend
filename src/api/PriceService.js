import apiClient from "./apiClient";

export const getPricesId = async (ids, startTime, endTime) => {

    const payload = {
        ids,
        startTime,
        endTime
    }
    //const idsString = ids.map(id => `ids=${id}`).join('&');
    const response = await apiClient.post(`/api/price/filter`, payload);
    return response.data;

};

export const getPriceIds = async (ids) => {

    const response = await apiClient.post(`/api/Price/byids`, ids);
    return response.data;

};