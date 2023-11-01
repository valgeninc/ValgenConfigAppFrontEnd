import "./App.css";

import { Route, Routes } from "react-router-dom";
import Subscribers from "./components/subscribersList/Subscribers";
import SubscriptionList from "./components/subscriptionsList/SubscriptionList";
import Login from "./components/auth/Login/Login";


function App() {
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
