import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CheckoutCustomer = () => {
    const navigate = useNavigate();
    const navigateToMainScreen = () => {
        navigate('/');
    };

    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/customers/${id}`);
                setCustomer(response.data);
            } catch (error) {
                console.error('There was an error fetching the customer!', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomer();
    }, [id]);

    const handleCheckout = async () => {
        try {
            alert('Checkout completed successfully');
            navigateToMainScreen();
            await axios.delete(`http://localhost:8080/api/customers/checkout/${id}`);
        } catch (error) {
            console.error('There was an error during checkout!', error);
            alert('Failed to complete checkout');
        }
    };
    if (loading) {
        return <div>Loading...</div>;
    }
    if (!customer) {
        return <div>Customer not found</div>;
    }

    return (
        <div className='form-body'>
            <div className="add-employee-container">
                <div className="form-card">
                    <h2>Checkout Customer</h2>
                    <form onSubmit={handleCheckout}>
                        <fieldset>
                            <div className='form-inside'>
                                <label>
                                    Full Name:
                                    <input type="text" value={customer.name} readOnly />
                                </label>
                                <div className="input-group">
                                    <label>
                                        ID Type:
                                        <input type="text" value={customer.idType === "AADHAR_CARD" ? "AADHAR CARD" : customer.idType === "DRIVING_LICENSE" ? "DRIVING LICENSE" : "PASSPORT"} readOnly />
                                    </label>
                                    <label>
                                        ID Number:
                                        <input type="text" value={customer.idNumber} readOnly />
                                    </label>
                                </div>
                                <div className="input-group">
                                    <label>
                                        Phone Number:
                                        <input
                                            type="text" value={customer.phoneNumber} readOnly />
                                    </label>
                                    <label>
                                        Gender:
                                        <input type="text" value={customer.gender} readOnly />
                                    </label>
                                </div>
                                <div className="input-group">
                                    <label className='fixed-width'>
                                        Room Number:
                                        <input type="text" value={customer.allocatedRoomNumber} readOnly />
                                    </label>
                                    <label>
                                        Bed Type:
                                        <input type="text" value={customer.bedType} readOnly />
                                    </label>
                                    <label>
                                        Room Rate:
                                        <input type="number" value={customer.roomRate} readOnly />
                                    </label>
                                </div>
                                <div className='input-group'>
                                    <label>
                                        Check-In Date:
                                        <input
                                            type="text"
                                            value={customer.checkInTime}
                                            readOnly
                                        />
                                    </label>
                                    <label>
                                        Check-Out Date:
                                        <input
                                            type="text"
                                            value={customer.checkOutTime}
                                            readOnly
                                        />
                                    </label>
                                    <label>
                                        Number of Days:
                                        <input
                                            type="number"
                                            value={customer.numberOfDays}
                                            readOnly
                                        />
                                    </label>
                                </div>
                                <div className='input-group'>
                                    <label>
                                        Total Amount:
                                        <input
                                            type="number" value={customer.totalAmount} readOnly />
                                    </label>
                                    <label>
                                        Advance Payment:
                                        <input type="number" value={customer.advancePayment} readOnly />
                                    </label>
                                    <label>
                                        Pending Balance:
                                        <input type="number" className='readonly-field' value={customer.pendingBalance} readOnly />
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                        <button type="submit">Checkout</button>
                    </form>
                </div>
            </div >
        </div>
    );
};
export default CheckoutCustomer;