package com.example.hms.repository;

import com.example.hms.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    @Query("SELECT c FROM Customer c WHERE c.allocatedRoomNumber = :roomNumber AND c.checkedOut = false AND (c.checkInTime < :checkOutTime AND c.checkOutTime > :checkInTime)")
    List<Customer> findOccupiedRooms(@Param("roomNumber") String roomNumber, @Param("checkInTime") LocalDate checkInTime, @Param("checkOutTime") LocalDate checkOutTime);

    @Query("SELECT c FROM Customer c WHERE c.allocatedRoomNumber = :roomNumber AND c.checkedOut = false AND (c.checkOutTime >= :currentDate)")
    List<Customer> findCurrentOrFutureBookings(@Param("roomNumber") String roomNumber, @Param("currentDate") LocalDate currentDate);

    List<Customer> findByCheckInTime(LocalDate checkInTime);

    List<Customer> findByCheckOutTime(LocalDate checkOutTime);
}
