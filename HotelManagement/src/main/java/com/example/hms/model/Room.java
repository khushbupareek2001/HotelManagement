package com.example.hms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long roomId;

    @NotBlank(message = "Room number is mandatory")
    @Column(nullable = false, unique = true)
    private String roomNumber;

    @NotNull(message = "Availability status is mandatory")
    @Enumerated(EnumType.STRING)
    private RoomEnums.Availability availability;

    @NotNull(message = "Cleaning status is mandatory")
    @Enumerated(EnumType.STRING)
    private RoomEnums.CleaningStatus cleaningStatus;

    @NotNull(message = "Price is mandatory")
    @Positive(message = "Price must be a positive number")
    private Double price;

    @NotNull(message = "Bed type is mandatory")
    @Enumerated(EnumType.STRING)
    private RoomEnums.BedType bedType;


    enum Availability {
        AVAILABLE,
        OCCUPIED;
    }
}
