import axios from "axios";
import { auth } from "../lib/firebase"


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
})

api.interceptors.request.use(async (config) => {
    const user = auth.currentUser
    if (user) {
        const token = await user.getIdToken()
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) auth.signOut()
        return Promise.reject(error)
    }
)

export default api