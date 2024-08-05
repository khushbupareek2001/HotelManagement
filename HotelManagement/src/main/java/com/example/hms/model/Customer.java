package com.example.hms.model;

import jakarta.persistence.*;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Enumerated(EnumType.STRING)
    private IdType idType;

    private String idNumber;
    private String name;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String allocatedRoomNumber;
    private LocalDate checkInTime;
    private LocalDate checkOutTime;
    private String phoneNumber;
    private boolean checkedOut;
    private RoomEnums.BedType bedType;
    private Double roomRate;
    private Integer numberOfDays;
    private Double totalAmount;
    private Double advancePayment;
    private Double pendingBalance;

    public enum Gender {
        MALE, FEMALE, OTHER
    }

    public enum IdType {
        AADHAR_CARD, DRIVING_LICENSE, PASSPORT
    }
}