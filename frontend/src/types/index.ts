

export type SeatStatus = "AVAILABLE" | "LOCKED" | "BOOKED"

export interface Seat {
    _id: string
    seatNumber: string
    status: SeatStatus
    userId?: string
}

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED"

export interface Booking {
    _id: string
    seatNumber: string
    userId: string
    status: BookingStatus
    createdAt: string
    updatedAt: string
}

export interface AuditLog {
    _id: string
    event: string
    userId: string
    seatNumber: string
    createdAt: string
}

export interface AdminBookings {
    status?: string
    seatNumber?: string
    userId?: string
}