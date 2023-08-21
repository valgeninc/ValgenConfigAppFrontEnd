// import { AxiosResponse } from 'axios';
// import { ISubscription } from "../types/index";
import api from "../services/interceptor";


export const getSubscription = async (id: string | undefined) => {

    try {
        if (!id) {
            throw new Error("Subscription ID is missing");
        }

        return await api.get(`/subscribers/${id}`); // Use the interceptor-enabled 'api' instance
    } catch (error) {
        console.log('Error while calling editSubscribers API', error);
        throw error;
    }
    // try {
    //     if (!id) {
    //         throw new Error("Subscription ID is missing");
    //     }

    //     const response = await api.get('/subscribers/GetSubscription', {
    //         params: {
    //             SubscriberId: id,
    //         },
    //     });

    //     return response.data;
    // } catch (error) {
    //     console.log('Error while calling getSubscription API', error);
    //     throw error;
    // }

}