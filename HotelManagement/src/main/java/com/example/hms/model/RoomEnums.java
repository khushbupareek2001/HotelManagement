package com.example.hms.model;

public class RoomEnums {
    public enum Availability {
        AVAILABLE,
        OCCUPIED;
        public static Availability fromString(String availability) {
            return Availability.valueOf(availability.toUpperCase());
        }
    }
    public enum CleaningStatus {
        CLEANED,
        DIRTY;
        public static CleaningStatus fromString(String cleaningStatus) {
            return CleaningStatus.valueOf(cleaningStatus.toUpperCase());
        }
    }
    public enum BedType {
        SINGLE,
        DOUBLE;
        public static BedType fromString(String bedType) {
            return BedType.valueOf(bedType.toUpperCase());
        }
    }
}
