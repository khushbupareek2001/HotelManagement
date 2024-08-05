package com.example.hms.service;

import com.example.hms.dto.CustomerDTO;
import com.example.hms.model.Customer;
import com.example.hms.model.Room;

import java.util.List;

public interface CustomerService {
    Customer addCustomer(CustomerDTO customerDTO);

    List<Room> getAvailableRooms();

    List<Customer> getAllCustomers();

    Customer getCustomerById(Long id);

    Customer updateCustomerRoom(Long id, String roomNumber);

    Room updateCleaningStatus(String roomNumber, String cleaningStatus);

    Customer checkoutCustomer(Long id);

    void completeCheckout(Long id);
}
