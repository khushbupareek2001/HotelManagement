package com.example.hms.repository;

import com.example.hms.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    @Query("SELECT c FROM Customer c WHERE c.allocatedRoomNumber = :roomNumber AND c.checkedOut = false AND (:checkInTime BETWEEN c.checkInTime AND c.checkOutTime OR :checkOutTime BETWEEN c.checkInTime AND c.checkOutTime OR c.checkInTime BETWEEN :checkInTime AND :checkOutTime)")
    List<Customer> findOccupiedRooms(@Param("roomNumber") String roomNumber, @Param("checkInTime") LocalDate checkInTime, @Param("checkOutTime") LocalDate checkOutTime);
}
