package com.example.hms.service;

import com.example.hms.model.Employee;

import java.util.List;

public interface EmployeeService {
    Employee addEmployee(Employee employee);

    List<Employee> getAllEmployees();

    void deleteEmployee(Long id);
}
