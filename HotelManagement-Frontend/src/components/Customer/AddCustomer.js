import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const AddCustomer = () => {
    const navigate = useNavigate();
    const navigateToMainScreen = () => {
        navigate('/');
    };
    const [idType, setIdType] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('IN');
    const [gender, setGender] = useState('');
    const [allocatedRoomNumber, setAllocatedRoomNumber] = useState('');
    const [availableRooms, setAvailableRooms] = useState([]);
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [bedType, setBedType] = useState('');
    const [price, setprice] = useState('');
    const [numberOfDays, setNumberOfDays] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [advancePayment, setAdvancePayment] = useState('');
    const [pendingBalance, setPendingBalance] = useState(0);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchAvailableRooms = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/rooms');
                const sortedRooms = response.data.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));
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
        if (checkInDate && checkOutDate) {
            const diffTime = Math.abs(new Date(checkOutDate) - new Date(checkInDate));
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setNumberOfDays(diffDays);
        }
    }, [checkInDate, checkOutDate]);
    useEffect(() => {
        setTotalAmount(numberOfDays * price);
    }, [numberOfDays, price]);

    useEffect(() => {
        setPendingBalance(totalAmount - advancePayment);
    }, [totalAmount, advancePayment]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formValid = true;
        let validationErrors = {};

        const idMaxLength = idType === 'AADHAR_CARD' ? 12 : idType === 'DRIVING_LICENSE' ? 16 : idType === 'PASSPORT' ? 8 : null;
        if (idNumber.length !== idMaxLength) {
            validationErrors.idNumber = `Invalid ID number. Length of ID number must be ${idMaxLength}.`;
            formValid = false;
        }
        if (!gender) {
            validationErrors.gender = 'Please select gender';
            formValid = false;
        }
        setErrors(validationErrors);
        if (formValid) {
            const customer = { idType, idNumber, name, gender, allocatedRoomNumber, checkInTime: checkInDate, phoneNumber, checkOutTime: checkOutDate, totalAmount, advancePayment, pendingBalance };
            try {
                await axios.post('http://localhost:8080/api/customers/add', customer);
                alert('Customer added successfully');
                navigateToMainScreen();
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message)
                    alert(error.response.data.message);
                else
                    alert('Failed to add customer');
            }
        }
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        if (/^[A-Za-z\s]*$/.test(value) && value.trimStart() === value) {
            setName(value);
            setErrors(prev => ({ ...prev, name: '' }));
        } else {
            setErrors(prev => ({ ...prev, name: 'Full name should only contain letters.' }));
        }
    };
    const handleIdNumberChange = (e) => {
        const value = e.target.value;
        const idMaxLength = idType === 'AADHAR_CARD' ? 12 : idType === 'DRIVING_LICENSE' ? 16 : idType === 'PASSPORT' ? 8 : null;
        if (idMaxLength && value.length > idMaxLength) return;
        if ((idType === 'AADHAR_CARD' && /^\d*$/.test(value)) ||
            (idType !== 'AADHAR_CARD' && /^[A-Za-z0-9]*$/.test(value))) {
            setIdNumber(value);
            setErrors(prev => ({ ...prev, idNumber: '' }));
        } else {
            setErrors(prev => ({ ...prev, idNumber: `Invalid input for ${idType.replace('_', ' ').toLowerCase()}.` }));
        }
    };
    const handlePhoneNumberChange = (value) => {
        setPhoneNumber(value);
        if (value) {
            const phoneNumberObj = parsePhoneNumberFromString(value);
            if (phoneNumberObj && !phoneNumberObj.isPossible()) {
                setErrors({ ...errors, phoneNumber: 'Invalid phone number for the selected country.' });
            } else {
                setErrors({ ...errors, phoneNumber: '' });
            }
        }
    };
    const handleCountryChange = (country) => {
        setCountryCode(country);
        setErrors((prev) => ({ ...prev, phoneNumber: '' }));
        if (country !== 'IN') {
            setIdType('PASSPORT');
        }
        else { setIdType(''); }
        setIdNumber('');
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
        setErrors(prev => ({ ...prev, idNumber: '' }));
    }
    function formatCheckOutDateTime(now) {
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    return (
        <div className='form-body'>
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
                                            maxLength={30}
                                            minLength={2}
                                            onChange={handleNameChange}
                                            required
                                        />
                                        {errors.name && <p className='error-text'>{errors.name}</p>}
                                    </label>
                                    <div className="input-group">
                                        <label>
                                            Phone Number:
                                            <PhoneInput
                                                international
                                                defaultCountry='IN'
                                                value={phoneNumber}
                                                onChange={handlePhoneNumberChange}
                                                onCountryChange={handleCountryChange}
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
                                                    onChange={(e) => { setGender(e.target.value); setErrors(prev => ({ ...prev, gender: '' })); }}
                                                    required
                                                /> Male
                                                <input
                                                    type="radio"
                                                    value="FEMALE"
                                                    checked={gender === 'FEMALE'}
                                                    onChange={(e) => { setGender(e.target.value); setErrors(prev => ({ ...prev, gender: '' })); }}
                                                    required
                                                /> Female
                                                <input type="radio"
                                                    value="OTHER"
                                                    checked={gender === 'OTHER'}
                                                    onChange={(e) => { setGender(e.target.value); setErrors(prev => ({ ...prev, gender: '' })); }}
                                                    required
                                                /> Other</div>
                                            {errors.gender && <p className='error-text'>{errors.gender}</p>}
                                        </label>
                                    </div>
                                    <div className="input-group">
                                        <label>
                                            ID Type:
                                            {countryCode === 'IN' ? (
                                                <select
                                                    value={idType}
                                                    onChange={handleIdTypeChange}
                                                    required
                                                >
                                                    <option value="">Select</option>
                                                    <option value="DRIVING_LICENSE">Driving License</option>
                                                    <option value="AADHAR_CARD">Aadhar Card</option>
                                                    <option value="PASSPORT">Passport</option>
                                                </select>
                                            ) : (
                                                <input
                                                    type='text'
                                                    value="PASSPORT"
                                                    readOnly
                                                />
                                            )}
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
                                            <DatePicker
                                                id='checkInDate'
                                                placeholderText='Choose Date'
                                                selected={checkInDate}
                                                onChange={date => {
                                                    date = formatCheckOutDateTime(date);
                                                    console.log("KK checkin date:" + date)
                                                    setCheckInDate(date)
                                                    setCheckOutDate('')
                                                }}
                                                minDate={new Date()}
                                                dateFormat="yyyy-MM-dd"
                                                required
                                            />
                                        </label>
                                        <label>
                                            Check-Out Date:
                                            <DatePicker
                                                id='checkOutDate'
                                                placeholderText='Choose Date'
                                                selected={checkOutDate}
                                                onChange={date => {
                                                    date = formatCheckOutDateTime(date);
                                                    console.log("KK checkout date:" + date)
                                                    setCheckOutDate(date)
                                                }}
                                                dateFormat="yyyy-MM-dd"
                                                minDate={new Date(new Date(checkInDate).setDate(new Date(checkInDate).getDate() + 1))}
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
        </div>
    );
};
export default AddCustomer;