package com.example.hms.service;

import com.example.hms.model.Room;

import java.util.List;

public interface RoomService {
    Room addRoom(Room room);

    List<Room> getAllRooms();

    Room getRoomByRoomNumber(String roomNumber);

    Room updateRoom(Long id, Room roomDetails);

    void deleteRoom(Long id);
}
