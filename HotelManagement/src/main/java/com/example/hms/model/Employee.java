package com.example.hms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long employeeId;
    private String name;
    private int age;
    private String gender;
    private double salary;
    private String phoneNumber;
    @Column(unique = true, nullable = false)
    private String aadharNumber;
    private String emailAddress;
    private String department;
}
