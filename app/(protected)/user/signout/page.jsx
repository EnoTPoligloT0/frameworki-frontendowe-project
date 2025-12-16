
'use client'
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutForm() {

    const router = useRouter();

    useEffect(() => {
        const doSignOut = async () => {
            await signOut(auth);
            router.push("/");
        };
        doSignOut();
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Signing you out...</p>
            </div>
        </div>
    );
}
