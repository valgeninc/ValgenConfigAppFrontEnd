export interface ISubscriber {
    id: string;
    name: string;
    email:string;
    phone:string;
  }
  export interface ISubscription {
    subscriptionId: string;
    subscriberId: string;
    subscriberToken: string;
    startDate: string;
    endDate: string;
    maxRequests: number;
    timeWindow: number;
    isActive: boolean;
    subscriptionServicesModel: IService[];
  }
  
  interface IService {
    serviceId: string;
    subscriptionId: string;
    companyRecords: number;
    locationRecords: number;
    endPointDesc: string;
    columns: string[];
  }
  export interface ISubscriptionValidationErrors {
    maxRequests: string;
    timeWindow:string;
    startDate:string;
    endDate:string;
    [key: string]: string;
  }