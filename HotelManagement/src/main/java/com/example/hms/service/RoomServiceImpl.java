package com.example.hms.service;

import com.example.hms.exception.ResourceAlreadyExistsException;
import com.example.hms.exception.ResourceNotFoundException;
import com.example.hms.model.Room;
import com.example.hms.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    @Autowired
    public RoomServiceImpl(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    public Room addRoom(Room room) {
        if (roomRepository.existsByRoomNumber(room.getRoomNumber())) {
            throw new ResourceAlreadyExistsException("Room already exists with room number: " + room.getRoomNumber());
        }
        return roomRepository.save(room);
    }

    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    public Room getRoomByRoomNumber(String roomNumber) {
        return roomRepository.findByRoomNumber(roomNumber);
    }

    @Override
    public Room updateRoom(Long id, Room roomDetails) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        if (!room.getRoomNumber().equals(roomDetails.getRoomNumber()) && roomRepository.existsByRoomNumber(roomDetails.getRoomNumber())) {
            throw new ResourceAlreadyExistsException("Room already exists with room number: " + roomDetails.getRoomNumber());
        }
        room.setAvailability(roomDetails.getAvailability());
        room.setCleaningStatus(roomDetails.getCleaningStatus());
        room.setPrice(roomDetails.getPrice());
        room.setBedType(roomDetails.getBedType());

        return roomRepository.save(room);
    }

    @Override
    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        roomRepository.delete(room);
    }
}