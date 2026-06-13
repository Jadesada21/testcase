import type { AdminBookings } from '../types'
import api from './axios'

export const getSeats = () =>
    api.get('/seats').then((r) => r.data)

export const createBooking = (seatNumber: string) =>
    api.post('/bookings', { seatNumber }).then((r) => r.data)

export const confirmBooking = (id: string) =>
    api.patch(`/bookings/${id}/confirm`).then((r) => r.data)

export const getMyBookings = () =>
    api.get('/bookings/my').then((r) => r.data)

export const getAdminBookings = (params?: AdminBookings) =>
    api.get('/admin/bookings', { params }).then((r) => r.data)

export const getAuditLog = (params?: { event?: string }) =>
    api.get('/admin/audit-logs', { params }).then((r) => r.data)

export const loginWithFirebase = (idToken: string) =>
    api.post('/auth/login', { idToken }).then((r) => r.data)