'use client'
import { useAuth } from "@/app/lib/AuthContext";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function ArticlesPage() {
    const { user } = useAuth();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Lab 9 Testing: Mock User for unauthenticated access
    const mockUser = { uid: "TEST_USER_123" };
    const effectiveUser = user || mockUser;

    useEffect(() => {
        // Always fetch, using effectiveUser
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "articles"), where("user", "==", effectiveUser.uid));
                const querySnapshot = await getDocs(q);
                const articlesData = [];
                querySnapshot.forEach((doc) => {
                    articlesData.push({ id: doc.id, ...doc.data() });
                });
                setArticles(articlesData);
            } catch (err) {
                console.error("Error fetching articles:", err);
                setError("Failed to load articles. " + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, [user]); // Re-run if real user logs in/out (effectiveUser logic handled inside or via deps, easier to just rerun)

    if (!user && !loading && articles.length === 0 && !error) {
        // Optional: Just a visual indicator that we are in test mode
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {!user && (
                <div className="mb-4 bg-yellow-100 p-2 text-center text-yellow-800 text-xs font-bold rounded">
                    ⚠️ TEST MODE: Viewing Articles for 'TEST_USER_123'
                </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Articles</h1>

            {error && (
                <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center text-gray-500">Loading articles...</div>
            ) : articles.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No articles found.</p>
                    <p className="text-sm text-gray-400 mt-2 mb-4">You haven't added any articles yet.</p>

                    <button
                        onClick={async () => {
                            try {
                                const { addDoc } = await import("firebase/firestore");
                                await addDoc(collection(db, "articles"), {
                                    title: "Test Article " + new Date().toLocaleTimeString(),
                                    content: "This is a test article created from the UI to verify Firestore integration.",
                                    user: effectiveUser.uid,
                                    date: new Date().toISOString()
                                });
                                // trigger re-fetch or rely on next render if we move fetch to separate function
                                window.location.reload(); // Simple reload to fetch new data
                            } catch (e) {
                                alert("Error creating article: " + e.message);
                            }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                        + Create Test Article
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {articles.map((article) => (
                        <div key={article.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 dark:border-gray-700">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{article.title || "Untitled Article"}</h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                    {article.content || "No content available."}
                                </p>
                                {article.date && (
                                    <p className="text-xs text-gray-400">
                                        {article.date.seconds ? new Date(article.date.seconds * 1000).toLocaleDateString() : article.date}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
