
'use client'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { useAuth } from "@/app/lib/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { auth } from "@/app/lib/firebase";

export default function RegisterForm() {
    const { user } = useAuth();
    const router = useRouter();
    const [registerError, setRegisterError] = useState("");

    if (user) {
        return null; // Or redirect
    }

    const onSubmit = (e) => {
        e.preventDefault();
        setRegisterError("");

        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (password !== confirmPassword) {
            setRegisterError("Passwords do not match.");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("User registered! UID:", userCredential.user.uid);
                sendEmailVerification(auth.currentUser)
                    .then(() => {
                        console.log("Email verification sent successfully according to SDK.");
                        router.push("/user/verify");
                    })
                    .catch((err) => {
                        console.error("Registration: Email Verification Failed", err);
                        // Still redirect or show error? For now redirect but log.
                        router.push("/user/verify");
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                let errorMessage = error.message;

                if (errorCode === 'auth/configuration-not-found') {
                    errorMessage = "Error: Email/Password sign-in is not enabled in Firebase Console. Please go to Build > Authentication > Sign-in method and enable it.";
                }

                setRegisterError(errorMessage);
                console.dir(error);
            });
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Create an account</h2>

                {registerError && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 text-sm flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        {registerError}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                        <input type="email" name="email" id="email" required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white" placeholder="you@example.com" />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input type="password" name="password" id="password" required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white" placeholder="••••••••" />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                        <input type="password" name="confirmPassword" id="confirmPassword" required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white" placeholder="••••••••" />
                    </div>

                    <div>
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                            Register
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link href="/user/signin" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
