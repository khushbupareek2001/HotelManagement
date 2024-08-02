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
    const handleInputChange = async (e, roomId) => {
        const { name, value } = e.target;
        if (name === 'price' && value < 0) {
            setError('Price must be a positive number.');
            return;
        } else {
            setError('');
        }
        setRooms((prevRooms) =>
            prevRooms.map((room) =>
                room.roomId === roomId ? { ...room, [name]: value } : room
            )
        );
        const updatedRoom = rooms.find(room => room.roomId === roomId);
        if (updatedRoom) {
            const updatedRoomDetails = { ...updatedRoom, [name]: value };
            try {
                await axios.put(`http://localhost:8080/api/rooms/${roomId}`, updatedRoomDetails);
            } catch (error) {
                console.error('There was an error updating the room!', error);
            }
        }
    };
    const handleDeleteRoom = (roomId) => {
        const room = rooms.find(room => room.roomId === roomId);
        if (room.availability === 'OCCUPIED') {
            setDeleteDialogMessage('Room is occupied by a guest and cannot be deleted.');
            setShowConfirmationButtons(false);
        } else {
            setDeleteDialogMessage('Are you sure you want to delete this room?');
            setShowConfirmationButtons(true);
        }
        setDeleteRoomId(roomId);
    };
    const confirmDeleteRoom = async () => {
        if (deleteRoomId && showConfirmationButtons) {
            try {
                await axios.delete(`http://localhost:8080/api/rooms/${deleteRoomId}`);
                setRooms((prevRooms) => prevRooms.filter((room) => room.roomId !== deleteRoomId));
                setDeleteRoomId(null);
                setDeleteDialogMessage('');
                setShowConfirmationButtons(false);
            } catch (error) {
                console.error('There was an error deleting the room!', error);
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
                                <td>
                                    <input
                                        type="number"
                                        name="price"
                                        className='smaller-box'
                                        min={1}
                                        value={room.price}
                                        onChange={(e) => handleInputChange(e, room.roomId)}
                                    />
                                </td>
                                <td>{room.availability}</td>
                                <td>
                                    <select
                                        name="cleaningStatus"
                                        value={room.cleaningStatus}
                                        onChange={(e) => handleInputChange(e, room.roomId)}
                                    >
                                        <option value="CLEANED">Cleaned</option>
                                        <option value="DIRTY">Dirty</option>
                                    </select>
                                </td>
                                <td>
                                    <select
                                        name="bedType"
                                        value={room.bedType}
                                        onChange={(e) => handleInputChange(e, room.roomId)}
                                    >
                                        <option value="SINGLE">Single</option>
                                        <option value="DOUBLE">Double</option>
                                    </select>
                                </td>
                                <td>
                                    <button onClick={() => handleDeleteRoom(room.roomId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {deleteDialogMessage && (
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
            )}
        </div>
    );
};
export default RoomDetails;