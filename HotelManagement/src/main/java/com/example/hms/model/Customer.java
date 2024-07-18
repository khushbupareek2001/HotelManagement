package com.example.hms.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
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
    private LocalDateTime checkInTime;

    private LocalDateTime checkOutTime;

    @NotNull(message = "Money deposit is mandatory")
    @Positive(message = "Money deposit must be a positive number")
    private Double moneyDeposit;

    @NotBlank(message = "Phone number is mandatory")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Phone number must be 10 digits and a valid number")
    private String phoneNumber;

    private boolean checkedOut;

    public enum Gender {
        MALE, FEMALE
    }

    public enum IdType {
        AADHAR_CARD, DRIVING_LICENSE, PASSPORT
    }
}