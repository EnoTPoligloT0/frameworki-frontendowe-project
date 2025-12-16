
'use client'
import { useAuth } from "@/app/lib/AuthContext";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useState, useEffect } from "react";

export default function ProfileForm() {
    const { user } = useAuth();

    if (!user) {
        return <div className="p-4 text-center">Please sign in to view this page.</div>;
    }

    return <ProfileFormContent user={user} />;
}

function ProfileFormContent({ user }) {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [displayName, setDisplayName] = useState(user.displayName || "");
    const [photoURL, setPhotoURL] = useState(user.photoURL || "");

    // Address state (Lab 9)
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [loadingAddress, setLoadingAddress] = useState(true);

    // Zadanie 4: Read address
    useEffect(() => {
        if (user?.uid) {
            const fetchAddress = async () => {
                setLoadingAddress(true);
                try {
                    const docRef = doc(db, "users", user.uid);
                    const snapshot = await getDoc(docRef);
                    if (snapshot.exists()) {
                        const data = snapshot.data();
                        if (data.address) {
                            // Using state setters instead of setValue (no ReactHookForm)
                            setCity(data.address.city || "");
                            setStreet(data.address.street || "");
                            setZipCode(data.address.zipCode || "");
                        }
                    }
                } catch (err) {
                    console.error("Error fetching address:", err);
                } finally {
                    setLoadingAddress(false);
                }
            };
            fetchAddress();
        } else {
            setLoadingAddress(false);
        }
    }, [user]);

    // Zadanie 1: Save address
    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            // Lab 8: Update Auth Profile
            await updateProfile(user, {
                displayName: displayName,
                photoURL: photoURL,
            });

            // Lab 9: Update Firestore Address
            await setDoc(doc(db, "users", user.uid), {
                address: {
                    city: city,     // Lab instructions order
                    street: street,
                    zipCode: zipCode
                }
            }, { merge: true });

            console.log("Document successfully written/updated for ID: ", user.uid);
            setSuccess("Profile and address updated successfully!");

        } catch (e) {
            console.error("Error adding document: ", e);
            setError("Error saving profile: " + e.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b dark:border-gray-700 pb-4">Profile Settings</h1>

            <div className="flex items-center space-x-6 mb-8">
                <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                    {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                        <svg className="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user.displayName || "User"}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    {user.emailVerified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mt-1"> Verified </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 mt-1"> Unverified </span>
                    )}
                    <div className="mt-2 text-xs text-gray-400 font-mono bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded select-all cursor-pointer" title="Click to copy" onClick={() => navigator.clipboard.writeText(user.uid)}>
                        UID: {user.uid}
                    </div>
                </div>
            </div>

            {error && <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">{error}</div>}
            {success && <div className="mb-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-lg text-sm">{success}</div>}

            <form onSubmit={onSubmit} className="space-y-6">
                {/* Lab 8 Fields */}
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input type="email" value={user.email} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm sm:text-sm text-gray-500 cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Display Name</label>
                        <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Photo URL</label>
                        <input type="text" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white" />
                    </div>
                </div>

                {/* Lab 9 Fields: Address */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Address (Lab 9)</h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Street</label>
                            <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} disabled={loadingAddress} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} disabled={loadingAddress} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Zip Code</label>
                            <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} disabled={loadingAddress} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed" />
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                        Save Changes
                    </button>
                    <p className="text-xs text-center text-gray-500 mt-2">
                        Updates Profile (Auth) and Address (Firestore)
                    </p>
                </div>
            </form>
        </div>
    );
}
