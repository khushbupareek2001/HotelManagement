package com.example.hms.controller;

import com.example.hms.dto.CustomerDTO;
import com.example.hms.model.Customer;
import com.example.hms.model.Room;
import com.example.hms.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")//http://localhost:3002
public class CustomerController {
    @Autowired
    private final CustomerService customerService;

    @Autowired
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/add")
    public Customer addCustomer(@Valid @RequestBody CustomerDTO customerDTO) {
        return customerService.addCustomer((customerDTO));
    }

    @GetMapping("/available-rooms")
    public List<Room> getAvailableRooms() {
        return customerService.getAvailableRooms();
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable Long id) {
        return customerService.getCustomerById(id);
    }

    @PutMapping("/update-room/{id}")
    public Customer updateCustomerRoom(@PathVariable Long id, @RequestParam String roomNumber) {
        return customerService.updateCustomerRoom(id, roomNumber);
    }

    @PutMapping("/checkout/{id}")
    public Customer checkoutCustomer(@PathVariable Long id) {
        return customerService.checkoutCustomer(id);
    }

    @DeleteMapping("/checkout/{id}")
    public ResponseEntity<String> completeCheckout(@PathVariable Long id) {
        customerService.completeCheckout(id);
        return ResponseEntity.ok("Employee deleted successfully.");
    }
}