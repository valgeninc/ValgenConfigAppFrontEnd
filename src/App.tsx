import "./App.css";

import { Route, Routes } from "react-router-dom";
import { useNavigate } from 'react-router';
import Subscribers from "./components/subscribersList/Subscribers";
import SubscriptionList from "./components/subscriptionsList/SubscriptionList";
import Login from "./components/auth/Login/Login";
import jwtDecode from 'jwt-decode';
import React, { useEffect } from "react";


function App() {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   // Check if token is expired
  //   const token = localStorage.getItem('userToken');
  //   if (token) {
  //     const decodedToken: any = jwtDecode(token);
  //     const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

  //     if (decodedToken.exp < currentTime) {
  //       // Token is expired, navigate to login page
  //       navigate('/login');
  //     }
  //   }
  // }, [navigate]);
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/subscribers" element={<Subscribers />} />
        <Route
          path="/subscribers/:subscriberId/subscriptions"
          element={<SubscriptionList />}
        />
      </Routes>
    </>
  );
}

export default App;
