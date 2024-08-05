package com.example.hms.dto;

import com.example.hms.model.Customer;
import com.example.hms.model.RoomEnums;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDTO {
    private long id;

    @NotNull(message = "ID type is mandatory")
    @Enumerated(EnumType.STRING)
    private Customer.IdType idType;

    @NotBlank(message = "ID number is mandatory")
    private String idNumber;

    @NotBlank(message = "Name is mandatory")
    private String name;

    @NotNull(message = "Gender is mandatory")
    @Enumerated(EnumType.STRING)
    private Customer.Gender gender;

    @NotBlank(message = "Allocated room number is mandatory")
    private String allocatedRoomNumber;


    @NotNull(message = "Check-in time is mandatory")
    private LocalDate checkInTime;

    @NotNull(message = "Check-out time is mandatory")
    private LocalDate checkOutTime;

    @NotBlank(message = "Phone number is mandatory")
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