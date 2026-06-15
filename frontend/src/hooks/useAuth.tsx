import { type User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { auth } from '../lib/firebase'
import { loginWithFirebase } from '../api'
import { setToken } from '../api/axios'

interface AuthContextType {
    user: FirebaseUser | null
    loading: boolean
    logout: () => Promise<void>
    accessToken: string | null
    userId: string | null
    role: string | null
}


const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
    accessToken: null,
    userId: null,
    role: null
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null)
    const [loading, setLoading] = useState(true)
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [role, setRole] = useState<string | null>(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const idToken = await firebaseUser.getIdToken()
                    const res = await loginWithFirebase(idToken)
                    setToken(res.access_token)
                    setAccessToken(res.access_token)
                    setUserId(res.user.id)
                    setRole(res.user.role)
                } catch (err) {
                    console.error('Backend login failed', err)
                }
            }
            setUser(firebaseUser)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const logout = async () => {
        setToken(null)
        setAccessToken(null)
        setUserId(null)
        setRole(null)
        await signOut(auth)
    }
    return (
        <AuthContext.Provider value={{ user, loading, logout, accessToken, userId, role }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)