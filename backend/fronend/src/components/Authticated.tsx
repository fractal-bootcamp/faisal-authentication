import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

const Authenticated = () => {
    const [logoutMessage, setLogoutMessage] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("authToken")

        if (!token) {
            navigate("/login")
        }
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem("authToken")
        setLogoutMessage("See ya sucker!")
        setTimeout(() => {
            navigate("/login")
        }, 1000);
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
                <h1 className="text-4xl text-gray-800 mb-6">
                    Welcome!
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                    You are successfully logged in.
                </p>

                <button onClick={handleLogout} className="w-full bg-red-600 text-white hover:bg-red-700 py-2 px-4 rounded-lg transition-all">
                    Logout
                </button>

                {logoutMessage && (
                    <p className="text-red-500 text-center mt-4">
                        {logoutMessage}
                    </p>
                )}

            </div>
        </div>
    )
}

export default Authenticated