import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null

const getSocket = () => {
    if (!socket) {
        socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
            transports: ['websocket'],
        })
    }
    return socket
}

export const useSocket = () => {
    const queryClient = useQueryClient()

    useEffect(() => {
        const s = getSocket()

        s.on('seat:updated', () => {
            queryClient.invalidateQueries({ queryKey: ['seats'] })
        })
        return () => {
            s.off('seat:updated')
        }
    }, [queryClient])
}