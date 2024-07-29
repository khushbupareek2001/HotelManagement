import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../Employee/Employee.css';

const AddRoom = () => {
    const navigate = useNavigate();
    const navigateToMainScreen = () => {
        navigate('/');
    };

    useEffect(() => {
        document.body.className = 'add-employee-body';
        return () => {
            document.body.className = '';
        }
    }, []);

    const [roomNumber, setRoomNumber] = useState('');
    const [availability, setAvailability] = useState('');
    const [cleaningStatus, setCleaningStatus] = useState('');
    const [price, setPrice] = useState('');
    const [bedType, setBedType] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const room = { roomNumber, availability, cleaningStatus, price, bedType };
        try {
            await axios.post('http://localhost:8080/api/rooms', room);
            alert('Room added successfully');
            navigateToMainScreen();
        } catch (error) {
            console.error('There was an error adding the room!', error);
        }
    };
    const handleRoomNumberChange = (e) => {
        const value = e.target.value;
        if (/^[A-Za-z0-9\s]*$/.test(value) && value.length <= 10 && value.trimStart() === value) {
            setRoomNumber(value);
            setErrors(prev => ({ ...prev, roomNumber: '' }));
        } else {
            setErrors(prev => ({ ...prev, roomNumber: 'Room number should not contain special characters and be up to 10 letters.' }));
        }
    };
    const handlePriceChange = (e) => {
        const value = e.target.value;
        if (value >= 0) {
            setPrice(value);
            setErrors(prev => ({ ...prev, price: '' }));
        } else {
            setErrors(prev => ({ ...prev, price: 'Price should be a positive number.' }));
        }
    };

    return (
        <div className="add-employee-container">
            <div className="form-card">
                <h2>Add New Room</h2>
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Room Information</legend>
                        <div className='form-inside'>
                            <label>
                                Room Number:
                                <input
                                    type="text"
                                    value={roomNumber}
                                    onChange={handleRoomNumberChange}
                                    required
                                />
                                {errors.roomNumber && <p className='error-text'>{errors.roomNumber}</p>}
                            </label>
                            <div className="input-group">
                                <label>
                                    Availability:
                                    <select
                                        value={availability}
                                        onChange={(e) => setAvailability(e.target.value)}
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="AVAILABLE">Available</option>
                                        <option value="OCCUPIED">Occupied</option>
                                    </select>
                                </label>
                                <label>
                                    Cleaning Status:
                                    <select
                                        value={cleaningStatus}
                                        onChange={(e) => setCleaningStatus(e.target.value)}
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="CLEANED">Cleaned</option>
                                        <option value="DIRTY">Dirty</option>
                                    </select>
                                </label>
                            </div>
                            <label>
                                Price:
                                <input
                                    type="number"
                                    value={price}
                                    min={1}
                                    onChange={handlePriceChange}
                                    required
                                />
                                {errors.price && <p className='error-text'>{errors.price}</p>}
                            </label>
                            <label>
                                Bed Type:
                                <select
                                    value={bedType}
                                    onChange={(e) => setBedType(e.target.value)}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="SINGLE">Single</option>
                                    <option value="DOUBLE">Double</option>
                                </select>
                            </label>
                        </div>
                    </fieldset>
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
};
export default AddRoom;