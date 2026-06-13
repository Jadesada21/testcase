import { type User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { auth } from '../lib/firebase'

interface AuthContextType {
    user: FirebaseUser | null
    loading: boolean
    logout: () => Promise<void>
}


const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const logout = () => signOut(auth)

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)