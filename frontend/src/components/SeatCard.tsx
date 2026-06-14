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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['seats'] }),
    })

    const confirmMutation = useMutation({
        mutationFn: (id: string) => confirmBooking(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['seats'] }),
    })

    const isMylocked = seat.status === 'LOCKED' && seat.userId === user?.uid

    const bgColor =
        seat.status === "AVAILABLE" ? "bg-green-500 hover:bg-blue-600 cursor-pointer" :
            seat.status === "LOCKED" && isMylocked ? "bg-yellow-500 cursor-pointer" :
                seat.status === "LOCKED" ? "bg-red-500 cursor-not-allowed" :
                    'bg-red-700 cursor-not-allowed'

    const handleClick = () => {
        if (seat.status === 'AVAILABLE') {
            bookMutation.mutate()
        } else if (isMylocked) {
            confirmMutation.mutate(seat._id)
        }
    }

    return (
        <div
            onClick={handleClick}
            title={isMylocked ? 'Click for confirm payment' : seat.seatNumber}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-mono font-bold text-white transition-all ${bgColor}`}
        >
            {bookMutation.isPending || confirmMutation.isPending
                ? '...'
                : seat.seatNumber}
        </div>
    )
} 