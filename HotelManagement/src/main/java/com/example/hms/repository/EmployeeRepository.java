package com.example.hms.repository;

import com.example.hms.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    boolean existsByAadharNumber(String aadharNumber);
}
