import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RoomDetails = () => {
    const navigate = useNavigate();
    const navigateToAddRoom = () => {
        navigate('/add-room');
    };
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState('');
    const [deleteRoomId, setDeleteRoomId] = useState(null);
    const [deleteDialogMessage, setDeleteDialogMessage] = useState('');
    const [showConfirmationButtons, setShowConfirmationButtons] = useState(false);
    const [editingRowId, setEditingRowId] = useState(null);
    const [editedRoomDetails, setEditedRoomDetails] = useState({});

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/rooms');
                const sortedRooms = response.data.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));
                setRooms(sortedRooms);
            } catch (error) {
                console.error('There was an error fetching the rooms!', error);
            }
        };
        fetchRooms();
    }, []);
    const handleEditClick = (room) => {
        setEditingRowId(room.roomId);
        setEditedRoomDetails({
            price: room.price,
            cleaningStatus: room.cleaningStatus,
            bedType: room.bedType
        });
    };
    const handleSaveClick = async (roomId) => {
        if (editedRoomDetails.price < 0) {
            alert('Price must be a positive number.');
            return;
        } else if (editedRoomDetails.price < 100 || editedRoomDetails.price > 50000) {
            alert('Price must be between 100 and 50000');
            return;
        }
        else {
            setError('');
        }
        const roomToUpdate = rooms.find(room => room.roomId === roomId);
        if (!roomToUpdate) {
            console.error('Room not found.');
            return;
        }
        const updatedRoomDetails = { roomNumber: roomToUpdate.roomNumber, availability: roomToUpdate.availability, cleaningStatus: editedRoomDetails.cleaningStatus, price: editedRoomDetails.price, bedType: editedRoomDetails.bedType, };

        try {
            await axios.put(`http://localhost:8080/api/rooms/${roomId}`,
                updatedRoomDetails
            );
            setRooms((prevRooms) => prevRooms.map((room) =>
                room.roomId === roomId ? { ...room, ...editedRoomDetails } : room
            ));
            setEditingRowId(null);
            setEditedRoomDetails({});
        } catch (error) {
            console.error('There was an error updating the room!', error);
        }
    };
    const handleInputChange = (e, field) => {
        const { value } = e.target;
        setEditedRoomDetails(prevDetails => ({ ...prevDetails, [field]: value }));
    };
    const handleDeleteRoom = async (roomId) => {
        const room = rooms.find(room => room.roomId === roomId);
        if (room.availability === 'OCCUPIED') {
            setDeleteDialogMessage('Room is occupied by a guest and cannot be deleted.');
            setShowConfirmationButtons(false);
        } else {
            try {
                const response = await axios.get(`http://localhost:8080/api/rooms/${room.roomNumber}/has-bookings`);
                if (response.data) {
                    setDeleteDialogMessage('Room has future bookings and cannot be deleted.');
                    setShowConfirmationButtons(false);
                } else {
                    setDeleteDialogMessage('Are you sure you want to delete this room?');
                    setShowConfirmationButtons(true);
                }
            } catch (error) {
                console.error('Error checking bookings:', error);
                setDeleteDialogMessage('Error checking bookings. Please try again.');
                setShowConfirmationButtons(false);
            }
        }
        setDeleteRoomId(roomId);
    };
    const confirmDeleteRoom = async () => {
        if (deleteRoomId) {
            try {
                await axios.delete(`http://localhost:8080/api/rooms/${deleteRoomId}`);
                setRooms((prevRooms) => prevRooms.filter((room) => room.roomId !== deleteRoomId));
                setDeleteRoomId(null);
                setDeleteDialogMessage('');
            } catch (error) {
                console.error('There was an error deleting the room!', error);
                setDeleteDialogMessage('There was an error deleting the room. Please try again.');
            }
        }
    };

    return (
        <div className="employee-details-container">
            <div className='row-box'>
                <h2>Room Details</h2>
                <button onClick={navigateToAddRoom}>Add Room</button>
            </div>
            {rooms.length === 0 ? (
                <div className="no-employees">No Room available !!!</div>
            ) : (
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>Room Number</th>
                            <th>Price</th>
                            <th>Availability</th>
                            <th>Cleaning Status</th>
                            <th>Bed Type</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room) => (
                            <tr key={room.roomId}>
                                <td>{room.roomNumber}</td>
                                <td >
                                    {editingRowId === room.roomId ? (
                                        <input
                                            type="number"
                                            name="price"
                                            className='smaller-box'
                                            value={editedRoomDetails.price}
                                            onChange={(e) => handleInputChange(e, 'price')}
                                        />
                                    ) : (
                                        room.price
                                    )}
                                    {error && <p className='error-text'>{error}</p>}
                                </td>
                                <td>{room.availability}</td>
                                <td>
                                    {editingRowId === room.roomId ? (
                                        <select
                                            name="cleaningStatus"
                                            value={editedRoomDetails.cleaningStatus}
                                            onChange={(e) => handleInputChange(e, 'cleaningStatus')}
                                        >
                                            <option value="CLEANED">Cleaned</option>
                                            <option value="DIRTY">Dirty</option>
                                        </select>
                                    ) : (
                                        room.cleaningStatus
                                    )}
                                </td>
                                <td>
                                    {editingRowId === room.roomId ? (
                                        <select
                                            name="bedType"
                                            value={editedRoomDetails.bedType}
                                            onChange={(e) => handleInputChange(e, 'bedType')}
                                        >
                                            <option value="SINGLE">Single</option>
                                            <option value="DOUBLE">Double</option>
                                        </select>
                                    ) : (
                                        room.bedType
                                    )}
                                </td>
                                <td>
                                    {editingRowId === room.roomId ? (
                                        <button onClick={() => handleSaveClick(room.roomId)} className='save-button'>Save</button>
                                    ) : (
                                        <button onClick={() => handleEditClick(room)} className='edit-button'>Edit</button>
                                    )}
                                    < button onClick={() => handleDeleteRoom(room.roomId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )
            }
            {
                deleteDialogMessage && (
                    <div className="delete-dialog">
                        <p>{deleteDialogMessage}</p>
                        <div className="dialog-buttons">
                            {showConfirmationButtons ? (
                                <>
                                    <button className="delete-button" onClick={confirmDeleteRoom}>Yes</button>
                                    <button className="dialog-button" onClick={() => { setDeleteDialogMessage(''); setDeleteRoomId(null); setShowConfirmationButtons(false); }}>No</button>
                                </>
                            ) : (
                                <button className="dialog-button" onClick={() => { setDeleteDialogMessage(''); setDeleteRoomId(null); }}>OK</button>
                            )}
                        </div>
                    </div>
                )
            }
        </div >
    );
};
export default RoomDetails;