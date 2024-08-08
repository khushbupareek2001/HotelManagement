package com.example.hms.utils;

import com.example.hms.model.Customer;
import com.example.hms.model.Room;
import com.example.hms.model.RoomEnums;
import com.example.hms.repository.CustomerRepository;
import com.example.hms.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@EnableScheduling
public class RoomAvailabilityUpdater {
    private final CustomerRepository customerRepository;
    private final RoomRepository roomRepository;

    @Autowired
    public RoomAvailabilityUpdater(CustomerRepository customerRepository, RoomRepository roomRepository) {
        this.customerRepository = customerRepository;
        this.roomRepository = roomRepository;
    }

    @Scheduled(cron = "0 0 10 * * *")
    public void markRoomsAsAvailable() {
        LocalDate today = LocalDate.now();
        List<Customer> customersCheckingOutToday = customerRepository.findByCheckOutTime(today);
        for (Customer customer : customersCheckingOutToday) {
            Room room = roomRepository.findByRoomNumber(customer.getAllocatedRoomNumber());
            if (room != null) {
                room.setAvailability(RoomEnums.Availability.AVAILABLE);
                roomRepository.save(room);
            }
        }
    }

    @Scheduled(cron = "0 0 12 * * *")
    public void markRoomsAsOccupied() {
        LocalDate today = LocalDate.now();
        List<Customer> customersCheckingInToday = customerRepository.findByCheckInTime(today);
        for (Customer customer : customersCheckingInToday) {
            Room room = roomRepository.findByRoomNumber(customer.getAllocatedRoomNumber());
            if (room != null) {
                room.setAvailability(RoomEnums.Availability.OCCUPIED);
                roomRepository.save(room);
            }
        }
    }
}