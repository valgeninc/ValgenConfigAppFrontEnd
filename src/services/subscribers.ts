import { AxiosResponse } from 'axios';
import { ISubscriber } from "../types/index";
import api  from "../services/interceptor";

export const getSubscribers = async (): Promise<ISubscriber[]> => {
    try {
        const response: AxiosResponse<ISubscriber[]> = await api.get("/Subscribers");
        return response.data;

    } catch (error) {
        console.log('Error while calling getUsers api ', error);
        throw error;
    }
}


export const addSubscribers = async (subscribers: any) => {
    try {
        return await api.post("/Subscribers", subscribers); // Use the interceptor-enabled 'api' instance
    } catch (error) {
        console.log('Error while calling addSubscribers API', error);
        throw error;
    }
}

export const editSubscribers = async (id: string, subscribers: any) => {
    try {
        return await api.put(`/Subscribers/${id}`, subscribers); // Use the interceptor-enabled 'api' instance
    } catch (error) {
        console.log('Error while calling editSubscribers API', error);
        throw error;
    }
}