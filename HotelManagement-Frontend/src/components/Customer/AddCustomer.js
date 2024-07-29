import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddCustomer = () => {
    const navigate = useNavigate();
    const navigateToMainScreen = () => {
        navigate('/');
    };
    useEffect(() => {
        document.body.className = 'add-employee-body';
        return () => {
            document.body.className = '';
        };
    }, []);
    const [idType, setIdType] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('MALE');
    const [allocatedRoomNumber, setAllocatedRoomNumber] = useState('');
    const [availableRooms, setAvailableRooms] = useState([]);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [bedType, setBedType] = useState('');
    const [price, setprice] = useState('');
    const [numberOfDays, setNumberOfDays] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [advancePayment, setAdvancePayment] = useState('');
    const [pendingBalance, setPendingBalance] = useState(0);
    const [errors, setErrors] = useState({});
    const checkInTime = formatDateTime();

    useEffect(() => {
        const fetchAvailableRooms = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/customers/available-rooms');
                const sortedRooms = response.data.sort((a, b) => a.roomNumber - b.roomNumber);
                setAvailableRooms(sortedRooms);
            } catch (error) {
                console.error('There was an error fetching the available rooms!', error);
            }
        };
        fetchAvailableRooms();
    }, []);
    useEffect(() => {
        if (allocatedRoomNumber) {
            const fetchRoomDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/rooms/${allocatedRoomNumber}`);
                    const room = response.data;
                    setBedType(room.bedType);
                    setprice(room.price);
                } catch (error) {
                    console.error('There was an error fetching the room details!', error);
                }
            };
            fetchRoomDetails();
        }
    }, [allocatedRoomNumber]);
    useEffect(() => {
        if (checkInTime && checkOutDate) {
            const diffTime = Math.abs(new Date(checkOutDate) - new Date(checkInTime));
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            console.log("KK check no. of days " + diffDays);
            console.log("KK checkout date " + checkOutDate);
            setNumberOfDays(diffDays);
        }
    }, [checkInTime, checkOutDate]);
    useEffect(() => {
        setTotalAmount(numberOfDays * price);
    }, [numberOfDays, price]);

    useEffect(() => {
        setPendingBalance(totalAmount - advancePayment);
    }, [totalAmount, advancePayment]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const customer = { idType, idNumber, name, gender, allocatedRoomNumber, checkInTime, phoneNumber, checkOutTime: checkOutDate, totalAmount, advancePayment, pendingBalance };
        try {
            await axios.post('http://localhost:8080/api/customers/add', customer);
            console.log("KK checkout customer final " + customer.checkInTime);
            console.log("KK checkout date final " + customer.checkOutTime);
            alert('Customer added successfully');
            navigateToMainScreen();
        } catch (error) {
            console.error('There was an error adding the customer!', error);
            alert('Failed to add customer');
        }
    };
    const handleNameChange = (e) => {
        const value = e.target.value;
        if (/^[A-Za-z\s]*$/.test(value) && value.length <= 30 && value.trimStart() === value) {
            setName(value);
            setErrors(prev => ({ ...prev, name: '' }));
        } else {
            setErrors(prev => ({ ...prev, name: 'Full name should contain only letters and be up to 30 characters.' }));
        }
    };
    const handleIdNumberChange = (e) => {
        const value = e.target.value;
        const idMaxLength = idType === 'AADHAR_CARD' ? 12 : idType === 'DRIVING_LICENSE' ? 16 : idType === 'PASSPORT' ? 8 : null;

        if (idMaxLength && value.length > idMaxLength) return;
        if (/^[A-Za-z0-9]*$/.test(value)) {
            setIdNumber(value);
            setErrors(prev => ({ ...prev, idNumber: '' }));
        } else {
            setErrors(prev => ({ ...prev, idNumber: 'ID number should not contain special characters.' }));
        }
    };
    const handlePhoneNumberChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value === '' || /^[6-9]/.test(value)) {
            setPhoneNumber(value);
            setErrors(prev => ({ ...prev, phoneNumber: '' }));
        } else {
            setErrors(prev => ({ ...prev, phoneNumber: 'Phone number should be a valid number.' }));
        }
    };
    const handleAdvancePaymentChange = (e) => {
        const value = e.target.value;
        if (value >= 0 && value <= totalAmount) {
            setAdvancePayment(value);
            setErrors(prev => ({ ...prev, advancePayment: '' }));
        } else {
            setErrors(prev => ({ ...prev, advancePayment: 'Advance payment should be a positive number and not exceed the total amount.' }));
        }
    };
    const handleIdTypeChange = (e) => {
        setIdType(e.target.value);
        setIdNumber('');
    }
    function formatDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    function formatCheckOutDateTime(now) {
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    return (
        <div className="add-employee-container">
            <div className="form-card">
                {availableRooms.length === 0 ? (
                    <p>Oops, no room available!!!</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <fieldset>
                            <legend>Guest Information</legend>
                            <div className='form-inside'>
                                <label>
                                    Full Name:
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={handleNameChange}
                                        required
                                    />
                                    {errors.name && <p className='error-text'>{errors.name}</p>}
                                </label>
                                <div className="input-group">
                                    <label>
                                        ID Type:
                                        <select
                                            value={idType}
                                            onChange={handleIdTypeChange}
                                            required
                                        >
                                            <option value="">Select</option>
                                            <option value="PASSPORT">Passport</option>
                                            <option value="DRIVING_LICENSE">Driving License</option>
                                            <option value="AADHAR_CARD">Aadhar Card</option>
                                        </select>
                                    </label>
                                    <label>
                                        ID Number:
                                        <input
                                            type="text"
                                            value={idNumber}
                                            onChange={handleIdNumberChange}
                                            required
                                        />
                                        {errors.idNumber && <p className='error-text'>{errors.idNumber}</p>}
                                    </label>
                                </div>
                                <div className="input-group">
                                    <label>
                                        Phone Number:
                                        <input
                                            type="text"
                                            maxLength={10}
                                            value={phoneNumber}
                                            onChange={handlePhoneNumberChange}
                                            required
                                        />
                                        {errors.phoneNumber && <p className='error-text'>{errors.phoneNumber}</p>}
                                    </label>
                                    <label>
                                        Gender:
                                        <div className='gender-options'>
                                            <input
                                                type="radio"
                                                value="MALE"
                                                checked={gender === 'MALE'}
                                                onChange={(e) => setGender(e.target.value)}
                                                required
                                            /> Male
                                            <input
                                                type="radio"
                                                value="FEMALE"
                                                checked={gender === 'FEMALE'}
                                                onChange={(e) => setGender(e.target.value)}
                                                required
                                            /> Female
                                            <input type="radio"
                                                value="OTHER"
                                                checked={gender === 'OTHER'}
                                                onChange={(e) => setGender(e.target.value)}
                                                required
                                            /> Other</div>

                                    </label>
                                </div>
                                <div className="input-group">
                                    <label className='fixed-width'>
                                        Room Number:
                                        <select
                                            value={allocatedRoomNumber}
                                            onChange={(e) => setAllocatedRoomNumber(e.target.value)}
                                            required
                                        >
                                            <option value="">Select</option>

                                            {availableRooms.length > 0 ? (
                                                availableRooms.map(room => (
                                                    <option key={room.id} value={room.roomNumber}>{room.roomNumber}</option>
                                                ))
                                            ) : (
                                                <option value="">No rooms available!!!</option>
                                            )}
                                        </select>
                                    </label>
                                    {allocatedRoomNumber && (
                                        <>
                                            <label>
                                                Bed Type:
                                                <input
                                                    type="text"
                                                    className='readonly-field'
                                                    value={bedType}
                                                    readOnly
                                                />
                                            </label>
                                            <label>
                                                Room Rate:
                                                <input
                                                    type="number"
                                                    className='readonly-field'
                                                    value={price}
                                                    readOnly
                                                />
                                            </label>
                                        </>
                                    )}
                                </div>
                                <div className='input-group'>
                                    <label>
                                        Check-In Date:
                                        <input
                                            type="text"
                                            className='readonly-field'
                                            value={checkInTime}
                                            readOnly
                                        />
                                    </label>
                                    <label>
                                        Check-Out Date:
                                        <DatePicker
                                            placeholderText='Choose Date'
                                            selected={checkOutDate}
                                            onChange={date => {
                                                date = formatCheckOutDateTime(date);
                                                setCheckOutDate(date)
                                            }}
                                            dateFormat="yyyy-MM-dd"
                                            minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Number of Days:
                                        <input
                                            type="number"
                                            className='readonly-field'
                                            value={numberOfDays}
                                            readOnly
                                        />
                                    </label>
                                </div>
                                <label>
                                    Total Amount:
                                    <input
                                        type="number"
                                        className='readonly-field'
                                        value={totalAmount}
                                        readOnly
                                    />
                                </label>
                                <div className='input-group'>
                                    <label>
                                        Advance Payment:
                                        <input
                                            type="number"
                                            value={advancePayment}
                                            onChange={handleAdvancePaymentChange}
                                            required
                                        />
                                        {errors.advancePayment && <p className='error-text'>{errors.advancePayment}</p>}
                                    </label>
                                    <label>
                                        Pending Balance:
                                        <input
                                            type="number"
                                            className='readonly-field'
                                            value={pendingBalance}
                                            readOnly
                                        />
                                    </label>
                                </div>
                                {errors.general && <p className='error-text'>{errors.general}</p>}
                            </div>
                        </fieldset>
                        <button type="submit">Save</button>
                    </form>
                )}
            </div>
        </div >
    );
};
export default AddCustomer;