
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
            <h1 className="text-6xl font-extrabold text-blue-600 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Page Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
            </p>
            <Link href="/" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all dark:focus:ring-blue-900">
                Go Back Home
            </Link>
        </div>
    );
}
