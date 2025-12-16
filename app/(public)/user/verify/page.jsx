
'use client'
import { signOut, getAuth, sendEmailVerification } from "firebase/auth";
import { useAuth } from "@/app/lib/AuthContext";
import { useEffect, useState } from "react";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation"; // Assuming next/navigation for useRouter
import Link from "next/link"; // Assuming next/link for Link component

export default function VerifyPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");

    const [resending, setResending] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (user?.email) {
            setEmail(user.email);
            // Sign out after a short delay or immediately, but we have the email now.
            // Using a small timeout can help ensure the UI has time to "settle" or just for better UX
            const timer = setTimeout(() => {
                signOut(auth).catch((err) => console.error("Sign out error", err));
            }, 3000); // Increased delay to 3s to allow reading/resending
            return () => clearTimeout(timer);
        }
    }, [user]);

    const handleResend = async () => {
        if (!user) {
            console.error("handleResend: No user found.");
            return;
        }
        console.log("handleResend: Attempting to resend email to:", user.email);
        setResending(true);
        setMessage("");
        try {
            await sendEmailVerification(user);
            console.log("handleResend: Firebase SDK returned success.");
            setMessage("Verification email sent successfully!");
        } catch (error) {
            console.error("handleResend: Error caught:", error);
            setMessage("Error sending email: " + error.message);
        }
        setResending(false);
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-6">
                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify your email</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    We&apos;ve sent a verification link to <strong>{email || user?.email}</strong>. Please check your inbox and click the link to verify your account.
                </p>

                <div className="mb-6">
                    <button
                        onClick={handleResend}
                        disabled={resending || !user}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed underline"
                    >
                        {resending ? "Sending..." : "Resend Verification Email"}
                    </button>
                    {message && <p className="text-xs mt-2 text-green-600 dark:text-green-400">{message}</p>}
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                    You have been signed out. Please sign in again after verification.
                </p>
                <div className="mt-8">
                    <Link href="/user/signin" className="text-base font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
