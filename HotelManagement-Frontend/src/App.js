import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainScreen from './components/Dashboard/MainScreen.js';
import AddEmployee from './components/Employee/AddEmployee';
import EmployeeDetails from './components/Employee/EmployeeDetails.js';
import AddRoom from './components/Room/AddRoom.js';
import RoomDetails from './components/Room/RoomDetails.js';
import AddCustomer from './components/Customer/AddCustomer.js';
import CustomerDetails from './components/Customer/CustomerDetails.js';
import CheckoutCustomer from './components/Customer/CheckoutCustomer.js';

function App() {
  React.useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('add-employee')) {
      document.body.className = 'add-employee-body';
    }
    else {
      document.body.className = 'main-screen-body';
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/employee-details" element={<EmployeeDetails />} />
        <Route path="/add-room" element={<AddRoom />} />
        <Route path="/room-details" element={<RoomDetails />} />
        <Route path="/add-customer" element={<AddCustomer />} />
        <Route path="/customer-details" element={<CustomerDetails />} />
        <Route path="/checkout/:id" element={<CheckoutCustomer />} />
      </Routes>
    </Router>
  );
}
export default App;