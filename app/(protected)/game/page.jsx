'use client';
import { useState } from 'react';
import WordSearch from '@/app/components/WordSearch';

export default function GamePage() {
    // Configuration state
    const [config, setConfig] = useState({
        cellColor: '#ffffff',
        highlightColor: '#4ade80', // green-400
        textColor: '#1f2937', // gray-800
        borderColor: '#e5e7eb',
        font: 'monospace'
    });
    const [gridSize, setGridSize] = useState(12);

    const words = ["REACT", "NEXTJS", "FIREBASE", "TAILWIND", "VERCEL", "NODE"];

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Word Search Game (Wykreślanka)
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Game Area */}
                <div className="lg:col-span-2 flex justify-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <WordSearch
                        size={gridSize}
                        words={words}
                        config={config}
                    />
                </div>

                {/* Configuration Panel */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-fit">
                    <h2 className="text-xl font-semibold mb-6 dark:text-white">Configuration</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grid Size</label>
                            <input
                                type="range"
                                min="10"
                                max="15"
                                value={gridSize}
                                onChange={(e) => setGridSize(parseInt(e.target.value))}
                                className="w-full"
                            />
                            <div className="text-right text-xs text-gray-500">{gridSize}x{gridSize}</div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cell Color</label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="color"
                                    value={config.cellColor}
                                    onChange={(e) => setConfig({ ...config, cellColor: e.target.value })}
                                    className="h-8 w-full rounded cursor-pointer"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Highlight Color</label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="color"
                                    value={config.highlightColor}
                                    onChange={(e) => setConfig({ ...config, highlightColor: e.target.value })}
                                    className="h-8 w-full rounded cursor-pointer"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Text Color</label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="color"
                                    value={config.textColor}
                                    onChange={(e) => setConfig({ ...config, textColor: e.target.value })}
                                    className="h-8 w-full rounded cursor-pointer"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Font Family</label>
                            <select
                                value={config.font}
                                onChange={(e) => setConfig({ ...config, font: e.target.value })}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="sans-serif">Sans Serif</option>
                                <option value="serif">Serif</option>
                                <option value="monospace">Monospace</option>
                                <option value="cursive">Cursive</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
