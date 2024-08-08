import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CustomerDetails = () => {
    const [customers, setCustomers] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                console.log('Fetching customers...');
                const response = await axios.get('http://localhost:8080/api/customers');
                console.log('Customers fetched:', response.data);
                const sortedCustomers = response.data.sort((a, b) => b.id - a.id);
                setCustomers(sortedCustomers);
            } catch (error) {
                console.error('There was an error fetching the customers!', error);
            } finally {
                setLoading(false);
            }
        };
        const fetchAvailableRooms = async () => {
            try {
                console.log('Fetching available rooms...');
                const response = await axios.get('http://localhost:8080/api/rooms');
                const sortedRooms = response.data.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));
                console.log('Available rooms fetched:', response.data);
                setAvailableRooms(sortedRooms);
            } catch (error) {
                console.error('There was an error fetching the available rooms!', error);
            }
        };
        fetchCustomers();
        fetchAvailableRooms();
    }, []);

    const handleRoomChange = async (customerId, roomNumber) => {
        try {
            await axios.put(`http://localhost:8080/api/customers/update-room/${customerId}`, null, {
                params: { roomNumber }
            });
            const customerResponse = await axios.get('http://localhost:8080/api/customers');
            const sortedCustomers = customerResponse.data.sort((a, b) => b.id - a.id);
            setCustomers(sortedCustomers);
            const roomResponse = await axios.get('http://localhost:8080/api/rooms');
            const sortedRooms = roomResponse.data.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));
            setAvailableRooms(sortedRooms);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message)
                alert(error.response.data.message);
            else
                console.error('There was an error updating the room!', error);
        }
    };
    const handleCheckout = (customerId) => {
        navigate(`/checkout/${customerId}`);
    };
    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="employee-details-container">
            <h2>Guest Details</h2>
            <input
                type='text'
                placeholder='Search by name'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='search-box'
            />
            {filteredCustomers.length === 0 ? (
                <div className="no-employees">No Guest available !!!</div>
            ) : (
                <table className='employee-table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Room Number</th>
                            <th>Check-In Date</th>
                            <th>Check-Out Date</th>
                            <th>Pending Balance</th>
                            <th>Checkout</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map((customer) => {
                            const availableRoomOptions = availableRooms.filter(
                                room => room.roomNumber !== customer.allocatedRoomNumber
                            );
                            return (
                                <tr key={customer.id}>
                                    <td>{customer.name}</td>
                                    <td>{customer.gender}</td>
                                    <td>
                                        <select
                                            value={customer.allocatedRoomNumber}
                                            onChange={(e) => handleRoomChange(customer.id, e.target.value)}
                                        >
                                            <option value={customer.allocatedRoomNumber}>{customer.allocatedRoomNumber}</option>
                                            {availableRoomOptions.map((room) => (
                                                <option key={room.roomId} value={room.roomNumber}>
                                                    {room.roomNumber}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>{customer.checkInTime}</td>
                                    <td>{customer.checkOutTime}</td>
                                    <td>{customer.pendingBalance}</td>
                                    <td>
                                        <button onClick={() => handleCheckout(customer.id)}>Checkout</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};
export default CustomerDetails;
