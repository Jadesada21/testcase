import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBooking, confirmBooking } from '../api'
import { useAuth } from '../hooks/useAuth'
import { type Seat } from '../types'

interface Props {
    seat: Seat
}

export default function SeatCard({ seat }: Props) {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const bookMutation = useMutation({
        mutationFn: () => createBooking(seat.seatNumber),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seats'] })
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
            alert(`Payment completed! Seat ${seat.seatNumber} comfirmed`)
        },
        onError: (e: any) => {
            alert(`Payment Failed: ${e?.response?.data?.message ?? 'Please try again'}`)
        }
    })

    const isMylocked = seat.status === 'LOCKED' && seat.userId === user?.uid

    const bgColor =
        seat.status === "AVAILABLE" ? "bg-green-500 hover:bg-blue-600 cursor-pointer" :
            seat.status === "LOCKED" && isMylocked ? "bg-yellow-500 cursor-pointer" :
                seat.status === "LOCKED" ? "bg-red-500 cursor-not-allowed" :
                    'bg-red-700 cursor-not-allowed'

    const handleClick = () => {
        if (seat.status === 'AVAILABLE') {
            if (confirm(`Want to booked seat ${seat.seatNumber} Yes or No`)) {
                bookMutation.mutate()
            }
        } else if (isMylocked) {
            if (confirm(`Want to pay for seat ${seat.seatNumber} Yes or NO`))
                confirmMutation.mutate(seat._id)
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