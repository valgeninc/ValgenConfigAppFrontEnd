import { Dayjs } from "dayjs";

export interface ISubscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
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
  timeWindow: string;
  startDate: string;
  endDate: string;
  [key: string]: string;
}
export interface SubscriptionData {
  subscriptionId: string;
  subscriberId: string;
  startDate: string | null;
  endDate: string | null;
  subscriberToken: string;
  isActive: boolean;
  maxRequests: number | null;
  timeWindow: number | null;
  subscriptionServicesModel: ServiceModel[];
}
interface ServiceModel {
  serviceId: string;
  subscriptionId: string;
  endPointDesc: string;
  companyRecords: number| null;
  locationRecords: number| null;
  addtionalCompanyRecords: number| null;
  addtionalLocationRecords: number| null;
  columns: string[];
}
export interface IOption {
  label: string,
  options: Option[]
}
export interface Option {
  value: string;
  label: string;
}
export interface ColumnObject {
  anonymizedColumnList: string[];
  identifiedColumnList: string[];
}