import { useQuery } from "@tanstack/react-query";
import { getAdminBookings, getAuditLog } from "../api";
import { type Booking, type AuditLog } from '../types'

export default function AdminPage() {
    const { data: bookings = [] } = useQuery<Booking[]>({
        queryKey: ['admin-bookings'],
        queryFn: () => getAdminBookings(),
    })

    const { data: logs = [] } = useQuery<AuditLog[]>({
        queryKey: ['adit-logs'],
        queryFn: () => getAuditLog(),
    })

    return (
        <div className="min h-screen bg-gray-950 text-white p-8">
            <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>

            {/* Booking */}
            <section className="mb-10">
                <h2 className="text-lg font-semibold mb-4 text-gray-300">Bookings</h2>
                <div className="overflow-x-auto rounded-xl border border-gray-800">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-900 text-gray-400">
                            <tr>
                                <th className="px-4 py-3 text-left">Seat</th>
                                <th className="px-4 py-3 text-left">User</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b) => (
                                <tr key={b._id} className="border-t border-gray-800 hover:bg-gray-900">
                                    <td className="py-3 px-4 font-mono"></td>
                                    <td className="py-3 px-4 text-gray-400 truncate max-w-50">{b.userId}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.status === 'CONFIRMED' ? 'bg-green-900 text-green-300' :
                                            b.status === 'PENDING' ? 'bg-yellow-900 text-yellow-300' :
                                                'bg-red-900 text-red-300'
                                            }`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400">
                                        {new Date(b.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section >

            {/* Audit log */}
            <section>
                <h2 className="text-lg font-semibold mb-4 text-gray-300">Audit Logs</h2>
                <div className="overflow-x-auto rounded-xl border border-gray-800">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-900 text-gray-400">
                            <tr>
                                <th className="px-4 py-3 text-left">Event</th>
                                <th className="px-4 py-3 text-left">Seat</th>
                                <th className="px-4 py-3 text-left">User</th>
                                <th className="px-4 py-3 text-left">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log._id} className="border-t border-gray-800 hover:bg-gray-900">
                                    <td className="px-4 py-3 font-mono">{log.event}</td>
                                    <td className="px-4 py-3 font-mono">{log.seatNumber}</td>
                                    <td className="px-4 py-3 text-gray-400 truncate max-w-50">{log.userId}</td>
                                    <td className="px-4 py-3 text-gray-400">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>


        </div >
    )

} 