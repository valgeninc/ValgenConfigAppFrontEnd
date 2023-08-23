import { AxiosResponse } from "axios";
import api from "../services/interceptor";


export const getSubscription = async (id: string | undefined) => {
    try {
        if (!id) {
            throw new Error("Subscription ID is missing");
        }

        const response = await api.get('/subscribers/GetSubscription', {
            params: {
                SubscriberId: id,
            },
        });

        return response.data.result;
    } catch (error) {
        console.log('Error while calling getSubscription API', error);
        // throw error;
    }

}
export const createSubscription = async (subscription: any) => {
    try {
        return await api.post("/subscribers/CreateSubscription", subscription);
    } catch (error) {
        console.log('Error while calling addSubscribers API', error);
        // throw error;
    }
}

export const getColumnList = async () => {
    try {
        const response: AxiosResponse<any> = await api.get("/subscribers/GetColumnList");
        return response.data.result;

    } catch (error) {
        console.log('Error while calling getUsers api ', error);
        // throw error;
    }
}
export const renewSubscription = async (subscriptionId: string | undefined, isActive: boolean) => {
    const renewSubscriptionPayload = {
        subscriptionId: subscriptionId,
        isActive: isActive
    }
    try {
        return await api.put(`/subscribers/RenewSubscription`, renewSubscriptionPayload);
    } catch (error) {
        console.log('Error while calling editSubscribers API', error);
        // throw error;
    }
}

export const updateSubscription = async (subscription: any) => {
    try {
        return await api.put("/subscribers/UpdateSubscription", subscription); 
    } catch (error) {
        console.log('Error while calling addSubscribers API', error);
        // throw error;
    }
}
