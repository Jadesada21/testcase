import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../lib/firebase'
import { loginWithFirebase } from "../api";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
    const { user } = useAuth()

    if (user) return <Navigate to="/" replace />

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider)
            const idToken = await result.user.getIdToken()
            await loginWithFirebase(idToken)
        } catch (err) {
            console.error('Login Failed', err)
        }
    }

    return (
        <div className="flex h-screen items-center justify-center bg-[#370350]">
            <div className="rounded-2xl bg-gray-900 p-10 flex flex-col items-center gap-6">
                <h1 className="text-2xl font-bold text-white">Cinema Booking</h1>
                <p className="text-gray-400 text-sm">Login for Reserved seat</p>

                <button
                    onClick={handleLogin}
                    className="flex items-center gap-3 bg-white text-gray-900 font-medium px-6 py-3 rounded-xl hover:bg-gray-100 transition  cursor-pointer active:scale-90"
                >
                    <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
                    Sign in With Google
                </button>
            </div>
        </div >
    )
}