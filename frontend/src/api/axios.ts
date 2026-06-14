import axios from "axios";
import { auth } from "../lib/firebase"


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
})

let _accessToken: string | null = null

export const setToken = (token: string | null) => { _accessToken = token }
export const getToken = () => _accessToken

api.interceptors.request.use(async (config) => {
    const token = getToken()
    if (!token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    const user = auth.currentUser
    if (user) {
        const token = await user.getIdToken()
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            const user = auth.currentUser
            if (user) {
                try {
                    const freshToken = await user.getIdToken(true)
                    originalRequest.headers.Authorization = `Bearer ${freshToken}`
                    return api(originalRequest)
                } catch {
                    await auth.signOut()
                }
            } else {
                await auth.signOut()
            }
        }
        return Promise.reject(error)
    }
)

export default api