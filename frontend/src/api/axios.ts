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
    if (token) {
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
                    const idToken = await user.getIdToken(true)
                    const res = await api.post('/auth/login', { idToken })
                    const newJwt = res.data.access_token
                    setToken(newJwt)
                    originalRequest.headers.Authorization = `Bearer ${newJwt}`
                    return api(originalRequest)
                } catch {
                    setToken(null)
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