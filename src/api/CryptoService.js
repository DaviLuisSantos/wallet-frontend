import apiClient from "./apiClient";

export const getCryptosIds = async (ids) => {

    const response = await apiClient.post(`/api/cryptocurrency/ids`, ids);
    return response.data;

};
