
'use client'
import { useAuth } from "@/app/lib/AuthContext";
import Link from "next/link";

export default function MainLayout({ children }) {
    const { user } = useAuth();

    return (
        <>
            {/* Header/Top Bar */}
            <nav className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center z-10 sticky top-0">
                <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                    LabApp
                </Link>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <div className="flex items-center space-x-2">
                                <Link href="/game" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-500 transition-colors mr-4">
                                    Game
                                </Link>
                                <Link href="/articles" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-500 transition-colors mr-4">
                                    Articles
                                </Link>
                                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="Avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        <svg className="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    )}
                                </div>
                                <span className="text-sm font-medium hidden sm:block text-gray-700 dark:text-gray-300">{user.displayName || user.email}</span>
                            </div>
                            <Link href="/user/signout" className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors">Sign Out</Link>
                        </>
                    ) : (
                        <>
                            <Link href="/user/signin" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors">Sign In</Link>
                            <Link href="/user/register" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all">Sign Up</Link>
                        </>
                    )}
                </div>
            </nav>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
                    <div className="p-4">
                        <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">Menu</h2>
                        <nav className="space-y-2">
                            <Link href="/" className="flex items-center space-x-3 px-3 py-2 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                <span>Home</span>
                            </Link>
                            {user && (
                                <Link href="/user/profile" className="flex items-center space-x-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 rounded-lg transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    <span>Profile</span>
                                </Link>
                            )}
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 md:p-8">
                    {children}
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Laboratory Project. Created by Student 15178.
            </footer>
        </>
    );
}
