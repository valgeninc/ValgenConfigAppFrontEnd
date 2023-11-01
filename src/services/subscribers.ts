import { AxiosResponse } from 'axios';
import api from "../services/interceptor";

export const getSubscribers = async (): Promise<any> => {
    try {
        const response: AxiosResponse<any> = await api.get("/Subscribers");
        return response.data.result;

    } catch (error) {
        console.error('Error while calling getUsers api ', error);
        throw error;
    }
}


export const addSubscribers = async (subscribers: any) => {
    try {
        return await api.post("/Subscribers", subscribers);
    } catch (error) {
        console.error('Error while calling addSubscribers API', error);
        throw error;
    }
}

export const editSubscribers = async (id: string, subscribers: any) => {
    try {
        return await api.put(`/Subscribers/${id}`, subscribers);
    } catch (error) {
        console.error('Error while calling editSubscribers API', error);
        throw error;
    }
}