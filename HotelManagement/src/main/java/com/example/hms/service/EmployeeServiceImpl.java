package com.example.hms.service;

import com.example.hms.dto.EmployeeDTO;
import com.example.hms.exception.ResourceNotFoundException;
import com.example.hms.model.Employee;
import com.example.hms.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.hms.exception.ResourceAlreadyExistsException;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    private Employee toEntity(EmployeeDTO dto) {
        Employee employee = new Employee();
        employee.setEmployeeId(dto.getEmployeeId());
        employee.setName(dto.getName());
        employee.setAge(dto.getAge());
        employee.setGender(dto.getGender());
        employee.setSalary(dto.getSalary());
        employee.setPhoneNumber(dto.getPhoneNumber());
        employee.setAadharNumber(dto.getAadharNumber());
        employee.setEmailAddress(dto.getEmailAddress());
        employee.setDepartment(dto.getDepartment());
        return employee;
    }

    @Override
    public Employee addEmployee(EmployeeDTO employeeDTO) {
        if (employeeRepository.existsByAadharNumber(employeeDTO.getAadharNumber())) {
            throw new ResourceAlreadyExistsException("Employee with Aadhar number " + employeeDTO.getAadharNumber() + " already exists.");
        }
        Employee employee = toEntity(employeeDTO);
        return employeeRepository.save(employee);
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee updateEmployee(Long id, EmployeeDTO updatedEmployeeDTO) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        employee.setName(updatedEmployeeDTO.getName());
        employee.setAge(updatedEmployeeDTO.getAge());
        employee.setGender(updatedEmployeeDTO.getGender());
        employee.setSalary(updatedEmployeeDTO.getSalary());
        employee.setPhoneNumber(updatedEmployeeDTO.getPhoneNumber());
        employee.setAadharNumber(updatedEmployeeDTO.getAadharNumber());
        employee.setEmailAddress(updatedEmployeeDTO.getEmailAddress());
        employee.setDepartment(updatedEmployeeDTO.getDepartment());
        return employeeRepository.save(employee);
    }

    @Override
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        employeeRepository.delete(employee);
    }

}

