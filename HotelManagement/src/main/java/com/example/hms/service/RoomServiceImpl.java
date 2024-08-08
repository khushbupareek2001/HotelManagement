package com.example.hms.service;

import com.example.hms.dto.RoomDTO;
import com.example.hms.exception.ResourceAlreadyExistsException;
import com.example.hms.exception.ResourceNotFoundException;
import com.example.hms.model.Customer;
import com.example.hms.model.Room;
import com.example.hms.repository.CustomerRepository;
import com.example.hms.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final CustomerRepository customerRepository;

    @Autowired
    public RoomServiceImpl(RoomRepository roomRepository, CustomerRepository customerRepository) {
        this.roomRepository = roomRepository;
        this.customerRepository = customerRepository;
    }

    private Room toEntity(RoomDTO dto) {
        Room room = new Room();
        room.setRoomId(dto.getRoomId());
        room.setRoomNumber(dto.getRoomNumber());
        room.setAvailability(dto.getAvailability());
        room.setCleaningStatus(dto.getCleaningStatus());
        room.setPrice(dto.getPrice());
        room.setBedType(dto.getBedType());
        return room;
    }

    @Override
    public Room addRoom(RoomDTO roomDTO) {
        if (roomRepository.existsByRoomNumber(roomDTO.getRoomNumber())) {
            throw new ResourceAlreadyExistsException("Room already exists with room number: " + roomDTO.getRoomNumber());
        }
        Room room = toEntity(roomDTO);
        return roomRepository.save(room);
    }

    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    public Room getRoomByRoomNumber(String roomNumber) {
        Room room = roomRepository.findByRoomNumber(roomNumber);
        if (room == null) {
            throw new ResourceNotFoundException("Room not found with room number: " + roomNumber);
        }
        return room;
    }

    @Override
    public Room updateRoom(Long id, RoomDTO roomDTO) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        if (!room.getRoomNumber().equals(roomDTO.getRoomNumber()) && roomRepository.existsByRoomNumber(roomDTO.getRoomNumber())) {
            throw new ResourceAlreadyExistsException("Room already exists with room number: " + roomDTO.getRoomNumber());
        }
        room.setAvailability(roomDTO.getAvailability());
        room.setCleaningStatus(roomDTO.getCleaningStatus());
        room.setPrice(roomDTO.getPrice());
        room.setBedType(roomDTO.getBedType());

        return roomRepository.save(room);
    }

    public boolean hasActiveCustomers(String roomNumber) {
        LocalDate now = LocalDate.now();
        List<Customer> activeCustomers = customerRepository.findCurrentOrFutureBookings(roomNumber, now);
        return !activeCustomers.isEmpty();
    }

    @Override
    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        roomRepository.delete(room);
    }
}