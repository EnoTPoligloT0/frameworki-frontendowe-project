
'use client'
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getAuth } from 'firebase/auth'
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from 'next/link';

import { Suspense } from "react";

export default function SignInPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignInForm />
        </Suspense>
    );
}

function SignInForm() {
    const auth = getAuth();
    const params = useSearchParams();
    const router = useRouter();
    const returnUrl = params.get("returnUrl");
    const [error, setError] = useState(null);

    const onSubmit = (e) => {
        e.preventDefault();
        const email = e.target["email"].value;
        const password = e.target["password"].value;
        setError(null);

        setPersistence(auth, browserSessionPersistence)
            .then(() => {
                signInWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        if (!user.emailVerified) {
                            // Lab 8 Task 6: Login without verified email -> redirect to verify and auto logout
                            router.push("/user/verify"); // Verify page handles the logout
                        } else {
                            if (returnUrl) {
                                router.push(returnUrl);
                            } else {
                                router.push("/");
                            }
                        }
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        let errorMessage = error.message;

                        if (errorCode === 'auth/configuration-not-found') {
                            errorMessage = "Error: Email/Password sign-in is not enabled in Firebase Console. Please go to Build > Authentication > Sign-in method and enable it.";
                        }

                        setError(errorMessage);
                        console.error(errorCode, errorMessage);
                    });
            })
            .catch(error => {
                setError(error.message);
                console.log(error);
            });
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Sign in to your account</h2>

                {/* Alert for errors */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 text-sm flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        {error}
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
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                            Sign In
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Don&apos;t have an account?{' '}
                        <Link href="/user/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
