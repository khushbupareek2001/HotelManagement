package com.example.hms.controller;

import com.example.hms.dto.RoomDTO;
import com.example.hms.model.Room;
import com.example.hms.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")//http://localhost:3002
public class RoomController {
    @Autowired
    private final RoomService roomService;

    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    public Room addRoom(@Valid @RequestBody RoomDTO roomDTO) {
        return roomService.addRoom(roomDTO);
    }

    @GetMapping
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/{roomNumber}")
    public Room getRoomByRoomNumber(@PathVariable String roomNumber) {
        return roomService.getRoomByRoomNumber(roomNumber);
    }

    @PutMapping("/{id}")
    public Room updateRoom(@PathVariable Long id, @Valid @RequestBody RoomDTO roomDTO) {
        return roomService.updateRoom(id, roomDTO);
    }

    @GetMapping("/{roomNumber}/has-bookings")
    public ResponseEntity<Boolean> checkRoomBookings(@PathVariable String roomNumber) {
        try {
            boolean hasBookings = roomService.hasActiveCustomers(roomNumber);
            return ResponseEntity.ok(hasBookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok("Room deleted successfully.");
    }
}