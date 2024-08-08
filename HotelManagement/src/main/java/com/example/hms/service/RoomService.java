package com.example.hms.service;

import com.example.hms.dto.RoomDTO;
import com.example.hms.model.Room;

import java.util.List;

public interface RoomService {
    Room addRoom(RoomDTO roomDTO);

    List<Room> getAllRooms();

    Room getRoomByRoomNumber(String roomNumber);

    Room updateRoom(Long id, RoomDTO roomDetails);

    boolean hasActiveCustomers(String roomNumber);

    void deleteRoom(Long id);
}
