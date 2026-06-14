

export type SeatStatus = "AVAILABLE" | "LOCKED" | "BOOKED"

export interface Seat {
    _id: string
    seatNumber: string
    status: SeatStatus
    lockedBy?: string | null
    userId?: string | null
}

export type BookingStatus = "PENDING" | "BOOKED" | "CANCELLED" | "TIMEOUT"

export interface Booking {
    _id: string
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