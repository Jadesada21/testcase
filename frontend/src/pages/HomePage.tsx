import { useQuery } from '@tanstack/react-query'
import { getSeats } from '../api'
import { useSocket } from '../hooks/useSocket'
import { useAuth } from '../hooks/useAuth'
import { type Seat } from '../types'
import SeatCard from '../components/SeatCard'

export default function HomePage() {
    const { user, logout } = useAuth()
    useSocket()

    const { data: seats = [], isLoading } = useQuery<Seat[]>({
        queryKey: ['seats'],
        queryFn: getSeats,
    })


    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

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
                            {rows.map((row) => (
                                <div
                                    key={row}
                                    className="flex items-center gap-3"
                                >
                                    <span className="w-5 text-sm text-gray-500 font-mono">{row}</span>
                                    <div className="flex gap-2">
                                        {seats
                                            .filter((s) => s.seatNumber.startsWith(row))
                                            .sort((a, b) => a.seatNumber.localeCompare(b.seatNumber))
                                            .map((seat) => (
                                                <SeatCard key={seat._id} seat={seat} />
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                <div className="flex gap-6 mt-10 justify-center text-sm text-gray-400">
                    <span className="flex items-center gap-2">
                        <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-gray-700" /> Available</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-gray-700" /> Locked</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-gray-700" /> Booked</span>
                    </span>
                </div>
            </div>
        </div>
    )
}