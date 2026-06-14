import { useQuery } from '@tanstack/react-query'
import { getMyBookings, getSeats } from '../api'
import { useSocket } from '../hooks/useSocket'
import { useAuth } from '../hooks/useAuth'
import { type Booking, type Seat } from '../types'
import SeatCard from '../components/SeatCard'

export default function HomePage() {
    const { user, logout } = useAuth()
    useSocket()

    const { data: seats = [], isLoading } = useQuery<Seat[]>({
        queryKey: ['seats'],
        queryFn: getSeats,
    })

    const { data: myBookings } = useQuery({
        queryKey: ['myBookings'],
        queryFn: getMyBookings
    })


    const rows = ['A', 'B', 'C', 'D', 'E']
    const displaySeat = [...rows].reverse()

    const seatsByRow = seats.reduce((acc, seat) => {
        const row = seat.seatNumber[0]
        if (!acc[row]) acc[row] = []

        acc[row].push(seat)
        return acc
    }, {} as Record<string, Seat[]>)

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
                <h1 className="text-lg font-bold">Cinema Booking</h1>
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-4">{user?.displayName}</span>
                    <button
                        onClick={logout}
                        className="text-sm text-gray-400 hover:text-white transition cursor-pointer active:scale-90 font-bold"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="mb-25 text-center">
                    <div className="h-2 bg-linear-to-r from transparent via-blue-400 to-transparent rounded-full mb-2" />
                    <span className="">Screen</span>
                </div>

                {isLoading ? (
                    <p className="text-center text-gray-500">Loading Seats...</p>
                ) : seats.length === 0 ? (
                    <p className="text-center text-grey-500">Not have a seat , Please seed</p>
                ) :

                    (
                        <div className="flex flex-col gap-3 items-center">
                            {displaySeat.map((row) => (
                                <div
                                    key={row}
                                    className="flex items-center gap-3"
                                >
                                    <span className="w-5 text-sm text-gray-500 font-mono">{row}</span>
                                    <div className="flex gap-2">
                                        {seatsByRow[row]
                                            ?.sort((a, b) => {
                                                const numA = parseInt(a.seatNumber.slice(1))
                                                const numB = parseInt(b.seatNumber.slice(1))
                                                return numA - numB
                                            })
                                            .map((seat) => (
                                                <SeatCard
                                                    key={seat._id}
                                                    seat={seat}
                                                    myBooking={myBookings?.find((b: Booking) => b.seatNumber === seat.seatNumber && b.status === 'PENDING')}
                                                />
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                <div className="flex gap-6 mt-10 justify-center text-sm text-gray-400">
                    <span className="flex items-center gap-2">
                        <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-green-700" /> Available</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-yellow-700" /> Locked</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-pink-700" /> My Locked</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-red-700" /> Booked</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-white" /> My Booked</span>
                    </span>
                </div>
            </div>
        </div>
    )
}