import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBooking, confirmBooking } from '../api'
import { useAuth } from '../hooks/useAuth'
import { type Booking, type Seat } from '../types'

interface Props {
    seat: Seat
    myBooking?: Booking
}


export default function SeatCard({ seat, myBooking }: Props) {
    const { userId } = useAuth()

    const queryClient = useQueryClient()

    const bookMutation = useMutation({
        mutationFn: () => createBooking(seat.seatNumber),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seats'] })
            queryClient.invalidateQueries({ queryKey: ['myBookings'] })
            alert(`Book a seat ${seat.seatNumber} succesfully! , Your have 5 minute for payment`)
        },
        onError: (e: any) => {
            alert(`Book a seat failed ${e?.response?.data?.message ?? 'Please try again'}`)
        }
    })

    const confirmMutation = useMutation({
        mutationFn: (id: string) => confirmBooking(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seats'] })
            queryClient.invalidateQueries({ queryKey: ['myBookings'] })
            alert(`Payment completed! Seat ${seat.seatNumber} comfirmed`)
        },
        onError: (e: any) => {
            alert(`Payment Failed: ${e?.response?.data?.message ?? 'Please try again'}`)
        }
    })

    const isMylocked = seat.status === 'LOCKED' && seat.lockedBy === userId
    const isMyBooked = seat.status === 'BOOKED' && seat.userId === userId

    const bgColor =
        seat.status === "AVAILABLE" ? "bg-green-700 hover:bg-blue-600 cursor-pointer" :
            seat.status === "LOCKED" && isMylocked ? "bg-pink-500 cursor-pointer" :
                seat.status === "LOCKED" ? "bg-yellow-700 cursor-not-allowed" :
                    seat.status === "BOOKED" && isMyBooked ? "bg-red-700 cursor-not-allowed" :
                        'bg-white cursor-not-allowed'

    const handleClick = () => {
        if (seat.status === 'AVAILABLE') {
            if (confirm(`Would you like to book seat ${seat.seatNumber} ?`)) {
                bookMutation.mutate()
            }
        } else if (isMylocked) {
            if (confirm(`Confirm payment for this seat ${seat.seatNumber} ?`)) {
                console.log('myBooking:', myBooking)
                confirmMutation.mutate(myBooking?.bookingId ?? myBooking?._id!)
            }
        }
    }

    return (
        <div
            onClick={handleClick}
            title={isMylocked ? 'Click for confirm payment' : seat.seatNumber}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-mono font-bold text-black transition-all ${bgColor}`}
        >
            {bookMutation.isPending || confirmMutation.isPending
                ? '...'
                : seat.seatNumber}
        </div>
    )
} 