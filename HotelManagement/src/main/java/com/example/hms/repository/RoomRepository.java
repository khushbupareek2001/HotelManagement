package com.example.hms.repository;

import com.example.hms.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByAvailability(String availability);

    Room findByRoomNumber(String roomNumber);

    boolean existsByRoomNumber(String roomNumber);
}
