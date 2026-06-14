

export type SeatStatus = "AVAILABLE" | "LOCKED" | "BOOKED"

export interface Seat {
    _id: string
    seatNumber: string
    status: SeatStatus
    userId?: string
    lockedBy?: string | null
}

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "TIMEOUT"

export interface Booking {
    _id: string
    bookingId: string
    seatNumber: string
    userId: string
    status: BookingStatus
    lockedUntil: string
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