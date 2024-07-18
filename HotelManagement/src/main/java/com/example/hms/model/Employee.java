package com.example.hms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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

    @NotBlank(message = "Name is mandatory")
    private String name;

    @NotNull(message = "Age is mandatory")
    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 60, message = "Age must be at most 60")
    private int age;

    @NotBlank(message = "Gender is mandatory")
    private String gender;

    @NotNull(message = "Salary is mandatory")
    @Positive(message = "Salary must be a positive number")
    private double salary;

    @NotBlank(message = "Phone number is mandatory")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Phone number must be 10 digits and a valid number")
    private String phoneNumber;

    @NotBlank(message = "Aadhar number is mandatory")
    @Pattern(regexp = "^\\d{12}$", message = "Aadhar number must be 12 digits")
    @Column(unique = true, nullable = false)
    private String aadharNumber;

    @NotBlank(message = "Email address is mandatory")
    @Email(message = "Email should be valid")
    @Pattern(regexp = "^.+@.+\\.(com|in|org)$", message = "Email must contain '@' and end with '.com', '.in', or '.org'")
    private String emailAddress;

    @NotBlank(message = "Department is mandatory")
    private String department;
}
