import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-8 p-6">
      <div className="max-w-4xl w-full space-y-8">
        <header className="space-y-4">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
            Frontend Laboratory
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Comprehensive demonstration of Next.js, Firebase Auth & Firestore, and Game Logic.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {/* Lab 7 & 8: Authentication */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-blue-50 dark:bg-gray-700/50">
              <h2 className="text-xl font-bold text-blue-800 dark:text-blue-300">Lab 7 & 8: Auth</h2>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Authentication Flow</p>
            </div>
            <div className="p-4 space-y-3">
              <Link href="/user/signin" className="block w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                🔐 Sign In
              </Link>
              <Link href="/user/register" className="block w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                📝 Register Account
              </Link>
              <Link href="/user/profile" className="block w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                👤 User Profile (Protected)
              </Link>
            </div>
          </div>

          {/* Lab 9: Firestore */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-emerald-50 dark:bg-gray-700/50">
              <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-300">Lab 9: Firestore</h2>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">Data Storage & Retrieval</p>
            </div>
            <div className="p-4 space-y-3">
              <Link href="/articles" className="block w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                📰 My Articles (Collection)
              </Link>
              <Link href="/user/profile" className="block w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                🏠 Edit Address (Doc Write)
              </Link>
            </div>
          </div>

          {/* Temat 6: Word Search */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-purple-50 dark:bg-gray-700/50">
              <h2 className="text-xl font-bold text-purple-800 dark:text-purple-300">Temat 6: Game</h2>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Word Search Logic</p>
            </div>
            <div className="p-4 space-y-3">
              <Link href="/game" className="block w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                🎮 Play Word Search
              </Link>
            </div>
          </div>
        </div>

        {/* General Instructions: Author Info */}
        <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-left">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About the Project</h3>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">
              This application was developed as part of the Frontend Frameworks laboratory (Labs 7-11).
              It demonstrates secure authentication, cloud database integration, and E2E testing.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              <strong>Author:</strong> Artem Ladovshchyk 15178 <br />
              <strong>Stack:</strong> Next.js 14, Firebase, Tailwind CSS
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
