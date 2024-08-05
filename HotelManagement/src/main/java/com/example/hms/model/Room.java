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
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long roomId;

    @Column(nullable = false, unique = true)
    private String roomNumber;

    @Enumerated(EnumType.STRING)
    private RoomEnums.Availability availability;

    @Enumerated(EnumType.STRING)
    private RoomEnums.CleaningStatus cleaningStatus;

    private Double price;

    @Enumerated(EnumType.STRING)
    private RoomEnums.BedType bedType;
}
