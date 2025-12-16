
'use client'
import { useAuth } from "@/app/lib/AuthContext";
import { useLayoutEffect } from "react";
import { redirect } from 'next/navigation';
import { usePathname } from 'next/navigation';

function Protected({ children }) {
    const { user, loading } = useAuth();
    const returnUrl = usePathname();

    useLayoutEffect(() => {
        if (!loading && !user) {
            redirect(`/user/signin?returnUrl=${returnUrl}`);
        }
    }, [user, loading, returnUrl]);

    if (loading) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (<>
        {children}
    </>);
}

export default Protected;
