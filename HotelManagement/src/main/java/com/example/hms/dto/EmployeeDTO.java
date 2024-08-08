package com.example.hms.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {
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
    private String phoneNumber;

    @NotBlank(message = "Aadhar number is mandatory")
    @Pattern(regexp = "^\\d{12}$", message = "Aadhar number must be 12 digits")
    private String aadharNumber;

    @NotBlank(message = "Email address is mandatory")
    @Email(message = "Email should be valid")
    @Pattern(regexp = "^.+@.+\\.(com|in|org)$", message = "Email must contain '@' and end with '.com', '.in', or '.org'")
    private String emailAddress;

    @NotBlank(message = "Department is mandatory")
    private String department;
}
