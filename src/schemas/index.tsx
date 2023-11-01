import * as Yup from "yup";

export const addEditSubscriberSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').max(200, 'Name should not exceed 200 characters'),
    phone: Yup.string().required('Phone is required.')
        .matches(/^(?=.*[0-9])[- +0-9]+$/, 'Invalid phone number format').max(20, 'Phone number should not exceed 20 digits'),
    email: Yup.string().matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,'Invalid email address').required('Email is required').max(50, 'Email should not exceed 50 characters'),
});