import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                navigate('/');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    if (!user) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-6 text-indigo-700">User Profile</h1>

                <div className="flex items-center space-x-4 mb-6">
                    {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-full" />
                    ) : (
                        <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {(user.displayName || user.email).charAt(0).toUpperCase()}
                        </div>
                    )}

                    <div>
                        <h2 className="text-xl font-semibold">{user.displayName || "User"}</h2>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-400">UID: {user.uid}</p>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
