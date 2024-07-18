package com.example.hms.service;

import com.example.hms.exception.ResourceNotFoundException;
import com.example.hms.model.Customer;
import com.example.hms.model.Room;
import com.example.hms.model.RoomEnums;
import com.example.hms.repository.CustomerRepository;
import com.example.hms.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final RoomRepository roomRepository;

    @Autowired
    public CustomerServiceImpl(CustomerRepository customerRepository, RoomRepository roomRepository) {
        this.customerRepository = customerRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    public Customer addCustomer(Customer customer) {
        customer.setCheckInTime(LocalDateTime.now());
        customer.setCheckedOut(false);

        Room room = roomRepository.findByRoomNumber(customer.getAllocatedRoomNumber());
        if (room != null && room.getAvailability() == RoomEnums.Availability.AVAILABLE) {
            room.setAvailability(RoomEnums.Availability.OCCUPIED);
            roomRepository.save(room);
        } else {
            throw new IllegalStateException("Room is not available");
        }
        return customerRepository.save(customer);
    }

    @Override
    public List<Room> getAvailableRooms() {
        return roomRepository.findByAvailability("available");
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    @Override
    public Customer updateCustomerRoom(Long id, String roomNumber) {

        Customer customer = customerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        Room oldRoom = roomRepository.findByRoomNumber(customer.getAllocatedRoomNumber());
        Room newRoom = roomRepository.findByRoomNumber(roomNumber);
        if (oldRoom != null) {
            oldRoom.setAvailability(RoomEnums.Availability.AVAILABLE);
            roomRepository.save(oldRoom);
        }
        if (newRoom != null && newRoom.getAvailability() == RoomEnums.Availability.AVAILABLE) {
            newRoom.setAvailability(RoomEnums.Availability.OCCUPIED);
            roomRepository.save(newRoom);
            customer.setAllocatedRoomNumber(roomNumber);
        } else {
            throw new IllegalStateException("New room is not available");
        }
        return customerRepository.save(customer);
    }


    @Override
    public Room updateCleaningStatus(String roomNumber, String cleaningStatus) {
        Room room = roomRepository.findByRoomNumber(roomNumber);
        if (room != null) {
            RoomEnums.CleaningStatus status = RoomEnums.CleaningStatus.fromString(cleaningStatus);
            room.setCleaningStatus(status);
            return roomRepository.save(room);
        } else {
            throw new ResourceNotFoundException("Room not found with room number: " + roomNumber);
        }
    }

    @Override
    public Customer checkoutCustomer(Long id) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        customer.setCheckOutTime(LocalDateTime.now());
        customer.setCheckedOut(true);
        Room room = roomRepository.findByRoomNumber(customer.getAllocatedRoomNumber());
        if (room != null) {
            room.setAvailability(RoomEnums.Availability.AVAILABLE);
            roomRepository.save(room);
        } else {
            throw new ResourceNotFoundException("Room not found with room number: " + customer.getAllocatedRoomNumber());
        }

        return customerRepository.save(customer);
    }

    @Override
    public void completeCheckout(Long id) {

        Customer customer = customerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        Room room = roomRepository.findByRoomNumber(customer.getAllocatedRoomNumber());
        if (room != null) {
            room.setAvailability(RoomEnums.Availability.AVAILABLE);
            roomRepository.save(room);
        } else {
            throw new ResourceNotFoundException("Room not found with room number: " + customer.getAllocatedRoomNumber());
        }

        customerRepository.deleteById(id);
    }
}
