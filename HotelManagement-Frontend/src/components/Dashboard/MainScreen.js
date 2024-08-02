import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainScreen.css';

import image1 from './../../assets/images/hotelBook1.jpg';
import image2 from './../../assets/images/hotelBook2.jpg';
import image3 from './../../assets/images/hotelBook3.jpg';
import image4 from './../../assets/images/hotelBook4.jpg';
import image6 from './../../assets/images/hotelBook6.jpg';
import image7 from './../../assets/images/hotelBook7.jpg';
import logo from './../../assets/images/AppLogoStayEase.PNG';

const images = [
    image4, image2, image3, image7, image6, image1
];

const MainScreen = () => {
    const navigate = useNavigate();

    const navigateToEmployeeDetails = () => {
        navigate('/employee-details');
    };
    const navigateToRoomDetails = () => {
        navigate('/room-details');
    };
    const navigateToAddCustomer = () => {
        navigate('/add-customer');
    };
    const navigateToCustomerDetails = () => {
        navigate('/customer-details');
    };

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="background" style={{ backgroundImage: `url(${images[currentImageIndex]})` }}>
            <header className="header">
                <img src={logo} alt="Stay Ease Logo" className="logo" />
                <nav className="nav">
                    <button className="nav-button" onClick={navigateToAddCustomer} >CheckIn</button>
                    <button className="nav-button" onClick={navigateToCustomerDetails}>Guest</button>
                    <button className="nav-button" onClick={navigateToRoomDetails}>Room</button>
                    <button className="nav-button" onClick={navigateToEmployeeDetails}>Employee</button>
                </nav>
            </header>
            <div className="content">
                <h1>Stay Ease</h1>
                <h2>Your gateway to hassle free stays</h2>
            </div>
        </div>
    );
};
export default MainScreen;