import axios, { AxiosResponse } from 'axios';
import { ISubscriber } from "../types/index";


const Url = 'http://localhost:3030/result';

const instance = axios.create({
    baseURL: "http://localhost:3030",
})


export const getSubscribers = async (): Promise<ISubscriber[]> => {
    try {
        const response: AxiosResponse<ISubscriber[]> = await instance.get("/result");
        return response.data;
    } catch (error) {
        console.log('Error while calling getUsers api ', error);
        throw error;
    }
}

export const addSubscribers = async (subscribers: any) => {
    return await axios.post(`${Url}`, subscribers);
}

export const editSubscribers = async (id: string, subscribers: any) => {
    return await axios.put(`${Url}/${id}`, subscribers)
}