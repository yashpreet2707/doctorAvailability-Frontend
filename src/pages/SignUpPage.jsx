import SignupForm from "../components/SignupForm";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function SignupPage() {
    const role = useSelector((state) => state.auth.role)
    const token = useSelector((state) => state.auth.token)

    if (token) {
        if (role === 'doctor') {
            return <Navigate to='/doctor-dashboard' />
        } else if (role === 'patient') {
            return <Navigate to='/patient-dashboard' />
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-black text-gray-100">
            <SignupForm />
        </div>
    );
}
