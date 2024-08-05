package com.example.hms.service;

import com.example.hms.dto.CustomerDTO;
import com.example.hms.exception.ResourceNotFoundException;
import com.example.hms.model.Customer;
import com.example.hms.model.Room;
import com.example.hms.model.RoomEnums;
import com.example.hms.repository.CustomerRepository;
import com.example.hms.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
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

    private Customer toEntity(CustomerDTO dto) {
        Customer customer = new Customer();
        customer.setId(dto.getId());
        customer.setIdType(dto.getIdType());
        customer.setIdNumber(dto.getIdNumber());
        customer.setName(dto.getName());
        customer.setGender(dto.getGender());
        customer.setAllocatedRoomNumber(dto.getAllocatedRoomNumber());
        customer.setCheckInTime(dto.getCheckInTime());
        customer.setCheckOutTime(dto.getCheckOutTime());
        customer.setPhoneNumber(dto.getPhoneNumber());
        customer.setCheckedOut(dto.isCheckedOut());
        customer.setBedType(dto.getBedType());
        customer.setRoomRate(dto.getRoomRate());
        customer.setNumberOfDays(dto.getNumberOfDays());
        customer.setTotalAmount(dto.getTotalAmount());
        customer.setAdvancePayment(dto.getAdvancePayment());
        customer.setPendingBalance(dto.getPendingBalance());
        return customer;
    }

    @Override
    public Customer addCustomer(CustomerDTO customerDTO) {
        Room room = roomRepository.findByRoomNumber(customerDTO.getAllocatedRoomNumber());
        if (room != null && room.getAvailability() == RoomEnums.Availability.AVAILABLE) {
            List<Customer> occupiedRooms = customerRepository.findOccupiedRooms(customerDTO.getAllocatedRoomNumber(), customerDTO.getCheckInTime(), customerDTO.getCheckOutTime());
            if (!occupiedRooms.isEmpty()) {
                throw new IllegalStateException("Room is already booked during the selected period");
            }
            customerDTO.setBedType(room.getBedType());
            customerDTO.setRoomRate(room.getPrice());
            roomRepository.save(room);
        } else {
            throw new IllegalStateException("Room is not available");
        }
        Customer customer = toEntity(customerDTO);
        calculateAdditionalFields(customer);
        return customerRepository.save(customer);
    }

    @Override
    public List<Room> getAvailableRooms() {
        return roomRepository.findByAvailability(RoomEnums.Availability.AVAILABLE);
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
            customer.setAllocatedRoomNumber(roomNumber);
            customer.setBedType(newRoom.getBedType());
            customer.setRoomRate(newRoom.getPrice());
            roomRepository.save(newRoom);
        } else {
            throw new IllegalStateException("New room is not available");
        }
        calculateAdditionalFields(customer);
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
        customer.setCheckOutTime(LocalDate.now());
        customer.setCheckedOut(true);
        Room room = roomRepository.findByRoomNumber(customer.getAllocatedRoomNumber());
        if (room != null) {
            room.setAvailability(RoomEnums.Availability.AVAILABLE);
            roomRepository.save(room);
        } else {
            throw new ResourceNotFoundException("Room not found with room number: " + customer.getAllocatedRoomNumber());
        }
        calculateAdditionalFields(customer);
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

    private void calculateAdditionalFields(Customer customer) {
        if (customer.getCheckInTime() != null && customer.getCheckOutTime() != null) {
            long numberOfDays = ChronoUnit.DAYS.between(customer.getCheckInTime(), customer.getCheckOutTime());
            customer.setNumberOfDays((int) numberOfDays);
            double totalAmount = numberOfDays * customer.getRoomRate();
            customer.setTotalAmount(totalAmount);
            double pendingBalance = totalAmount - customer.getAdvancePayment();
            customer.setPendingBalance(pendingBalance);
        } else {
            customer.setNumberOfDays(0);
            customer.setTotalAmount(0.0);
            customer.setPendingBalance(0.0);
        }
    }
}
