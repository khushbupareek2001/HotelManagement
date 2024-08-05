package com.example.hms.service;

import com.example.hms.dto.EmployeeDTO;
import com.example.hms.model.Employee;

import java.util.List;

public interface EmployeeService {
    Employee addEmployee(EmployeeDTO employeeDTO);

    List<Employee> getAllEmployees();

    Employee updateEmployee(Long id, EmployeeDTO employeeDTO);

    void deleteEmployee(Long id);
}
