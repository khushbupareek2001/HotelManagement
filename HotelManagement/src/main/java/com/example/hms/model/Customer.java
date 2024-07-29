package com.example.hms.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull(message = "ID type is mandatory")
    @Enumerated(EnumType.STRING)
    private IdType idType;

    @NotBlank(message = "ID number is mandatory")
    private String idNumber;

    @NotBlank(message = "Name is mandatory")
    private String name;

    @NotNull(message = "Gender is mandatory")
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @NotBlank(message = "Allocated room number is mandatory")
    private String allocatedRoomNumber;


    @NotNull(message = "Check-in time is mandatory")
    private LocalDate checkInTime;

    private LocalDate checkOutTime;

    @NotBlank(message = "Phone number is mandatory")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Phone number must be 10 digits and a valid number")
    private String phoneNumber;

    private boolean checkedOut;
    private RoomEnums.BedType bedType;
    private Double roomRate;
    private Integer numberOfDays;
    private Double totalAmount;

    @Min(value = 0, message = "Money must be a positive number")
    private Double advancePayment;

    private Double pendingBalance;

    public enum Gender {
        MALE, FEMALE, OTHER
    }

    public enum IdType {
        AADHAR_CARD, DRIVING_LICENSE, PASSPORT
    }
}