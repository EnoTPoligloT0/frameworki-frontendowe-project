'use client';
import { useState, useEffect, useRef } from 'react';

export default function WordSearch({ size = 10, words = [], config }) {
    const [grid, setGrid] = useState([]);
    const [selection, setSelection] = useState({ start: null, end: null, active: false });
    const [foundWords, setFoundWords] = useState([]);
    const [activeWords, setActiveWords] = useState([]); // Words actually placed
    const [highlightedCells, setHighlightedCells] = useState([]);
    const [solutionCells, setSolutionCells] = useState([]); // All coordinates of placed words
    const [showSolution, setShowSolution] = useState(false);
    const gridRef = useRef(null);

    // Initialize Grid
    useEffect(() => {
        generateGrid();
    }, [size, words]);

    const generateGrid = () => {
        // Try to generate a valid grid multiple times
        let bestGrid = null;
        let bestPlacedCount = 0;
        let actualPlacedWords = []; // To store the words successfully placed in the best grid
        let bestSolutionCells = [];

        for (let attempt = 0; attempt < 10; attempt++) {
            let currentGrid = Array(size).fill(null).map(() => Array(size).fill(''));
            let currentPlacedCount = 0;
            let currentPlacedWordsAttempt = [];
            let currentSolutionCells = [];

            // Simple word placement logic inside the retry loop
            const placeWordInGrid = (word, gridToUse) => {
                const directions = [
                    { r: 0, c: 1 },  // Horizontal
                    { r: 1, c: 0 },  // Vertical
                    { r: 1, c: 1 },  // Diagonal
                    { r: 0, c: -1 }, // Horizontal reverse
                    { r: -1, c: 0 }, // Vertical reverse
                    { r: -1, c: -1 }, // Diagonal reverse
                    { r: 1, c: -1 }, // Diagonal reverse
                    { r: -1, c: 1 }, // Diagonal reverse
                ];

                // Try to place word 50 times
                for (let i = 0; i < 50; i++) {
                    const dir = directions[Math.floor(Math.random() * directions.length)];
                    const startR = Math.floor(Math.random() * size);
                    const startC = Math.floor(Math.random() * size);

                    let fits = true;
                    for (let j = 0; j < word.length; j++) {
                        const r = startR + dir.r * j;
                        const c = startC + dir.c * j;
                        if (r < 0 || r >= size || c < 0 || c >= size || (gridToUse[r][c] !== '' && gridToUse[r][c] !== word[j].toUpperCase())) {
                            fits = false;
                            break;
                        }
                    }

                    if (fits) {
                        for (let j = 0; j < word.length; j++) {
                            const r = startR + dir.r * j;
                            const c = startC + dir.c * j;
                            gridToUse[r][c] = word[j].toUpperCase();
                            currentSolutionCells.push({ r, c });
                        }
                        return true;
                    }
                }
                return false;
            };

            words.forEach(word => {
                if (placeWordInGrid(word, currentGrid)) {
                    currentPlacedCount++;
                    currentPlacedWordsAttempt.push(word.toUpperCase());
                }
            });

            if (currentPlacedCount === words.length) {
                bestGrid = currentGrid;
                bestPlacedCount = currentPlacedCount;
                actualPlacedWords = currentPlacedWordsAttempt;
                bestSolutionCells = currentSolutionCells;
                break; // Found a perfect grid
            }

            // Keep the best attempt if we don't find a perfect one
            if (currentPlacedCount > bestPlacedCount) {
                bestGrid = currentGrid;
                bestPlacedCount = currentPlacedCount;
                actualPlacedWords = currentPlacedWordsAttempt;
                bestSolutionCells = currentSolutionCells;
            }
        }

        // If no grid was successfully generated (e.g., words array was empty, or size 0),
        // ensure bestGrid is initialized.
        if (!bestGrid) {
            bestGrid = Array(size).fill(null).map(() => Array(size).fill(''));
            actualPlacedWords = []; // No words placed
            bestSolutionCells = [];
        }

        let newGrid = bestGrid;

        // Update the list of words to find based on what actually fit
        setActiveWords(actualPlacedWords.sort());
        setSolutionCells(bestSolutionCells);

        if (bestPlacedCount < words.length) {
            console.warn(`Could not place all words. Placed ${bestPlacedCount}/${words.length}. Grid size might be too small.`);
        }

        // Fill empty spots on the best grid found
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (newGrid[r][c] === '') {
                    newGrid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
                }
            }
        }

        setGrid(newGrid);
        setFoundWords([]); // Reset game
        setHighlightedCells([]); // Reset highlights
        setShowSolution(false); // Reset cheat
    };

    const getCellFromEvent = (e) => {
        // Touch or Mouse support
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const element = document.elementFromPoint(clientX, clientY);
        if (element && element.dataset.row) {
            return { r: parseInt(element.dataset.row), c: parseInt(element.dataset.col) };
        }
        return null;
    };

    const handleStart = (r, c) => {
        setSelection({ start: { r, c }, end: { r, c }, active: true });
    };

    const handleMove = (e) => {
        if (!selection.active) return;
        const cell = getCellFromEvent(e);
        if (cell) {
            setSelection(prev => ({ ...prev, end: cell }));
        }
    };

    const handleEnd = () => {
        if (!selection.active) return;

        const { start, end } = selection;
        const selectedCells = getSelectedCells(start, end);
        const selectedWord = selectedCells.map(pos => grid[pos.r][pos.c]).join("");

        console.log("Selected Word Attempt:", selectedWord); // Debug

        // Check if word is valid (forward or reverse)
        const reversedWord = selectedWord.split('').reverse().join('');

        const found = activeWords.find(w => w.toUpperCase() === selectedWord || w.toUpperCase() === reversedWord);

        if (found) {
            console.log("Found Word:", found);
            if (!foundWords.includes(found.toUpperCase())) {
                const wordUpper = found.toUpperCase();
                setFoundWords(prev => [...prev, wordUpper]);
                setHighlightedCells(prev => [...prev, ...selectedCells]);
            }
        } else {
            console.log("Word NOT found in dictionary.");
        }

        setSelection({ start: null, end: null, active: false });
    };

    // Calculate cells between start and end for straight lines
    const getSelectedCells = (start, end) => {
        if (!start || !end) return [];

        const cells = [];
        const dr = end.r - start.r;
        const dc = end.c - start.c;
        const steps = Math.max(Math.abs(dr), Math.abs(dc));

        // Only allow straight lines (horizontal, vertical, diagonal)
        if (steps === 0) return [{ r: start.r, c: start.c }];

        // Check linearity: |dr| must equal |dc| (diagonal) OR one must be 0
        const isDiagonal = Math.abs(dr) === Math.abs(dc);
        const isStraight = dr === 0 || dc === 0;

        if (!isDiagonal && !isStraight) return [];

        const rInc = dr / steps;
        const cInc = dc / steps;

        for (let i = 0; i <= steps; i++) {
            cells.push({
                r: Math.round(start.r + rInc * i),
                c: Math.round(start.c + cInc * i)
            });
        }
        return cells;
    };

    const currentSelectionCells = selection.active ? getSelectedCells(selection.start, selection.end) : [];

    // Merge "permanently found" highlights with "currently selecting" highlights for display
    const isHighlighted = (r, c) => {
        return highlightedCells.some(cell => cell.r === r && cell.c === c) ||
            currentSelectionCells.some(cell => cell.r === r && cell.c === c);
    };

    const isSolution = (r, c) => {
        return showSolution && solutionCells.some(cell => cell.r === r && cell.c === c);
    };

    const allFound = activeWords.length > 0 && foundWords.length === activeWords.length;

    return (
        <div className="flex flex-col items-center select-none"
            onMouseUp={handleEnd}
            onTouchEnd={handleEnd}
            onMouseMove={handleMove}
            onTouchMove={handleMove}
        >
            <div
                className="grid gap-1 bg-gray-200 p-2 rounded"
                style={{
                    gridTemplateColumns: `repeat(${size}, minmax(30px, 1fr))`,
                    backgroundColor: config?.borderColor || '#e5e7eb' // tailwind gray-200 default
                }}
            >
                {grid.map((row, r) => (
                    row.map((letter, c) => {
                        const active = isHighlighted(r, c);
                        const cheat = isSolution(r, c);

                        let bgColor = config?.cellColor || '#ffffff';
                        if (active) bgColor = config?.highlightColor || '#93c5fd';
                        else if (cheat) bgColor = '#fef08a'; // yellow-200 for cheat

                        return (
                            <div
                                key={`${r}-${c}`}
                                data-row={r}
                                data-col={c}
                                onMouseDown={() => handleStart(r, c)}
                                onTouchStart={() => handleStart(r, c)}
                                className={`
                                    w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center 
                                    text-lg font-bold rounded cursor-pointer transition-colors
                                `}
                                style={{
                                    backgroundColor: bgColor,
                                    color: config?.textColor || '#000000',
                                    fontFamily: config?.font || 'sans-serif',
                                    border: (active || cheat) ? `2px solid ${config?.borderColor || 'transparent'}` : '1px solid #eee'
                                }}
                            >
                                <span className="pointer-events-none">{letter}</span>
                            </div>
                        );
                    })
                ))}
            </div>

            <div className="mt-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-2 dark:text-white">Words to Find ({foundWords.length}/{activeWords.length}):</h3>
                <div className="flex flex-wrap gap-2">
                    {activeWords.map(word => (
                        <span
                            key={word}
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${foundWords.includes(word.toUpperCase())
                                    ? 'bg-green-100 text-green-800 line-through dark:bg-green-900 dark:text-green-100'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                }`}
                        >
                            {word}
                        </span>
                    ))}
                </div>
            </div>

            {allFound && (
                <div className="mt-8 p-4 bg-green-500 text-white rounded-lg shadow-lg animate-bounce">
                    <h2 className="text-2xl font-bold">🎉 Congratulations! 🎉</h2>
                    <p>You found all the words!</p>
                </div>
            )}

            <div className="flex gap-4 mt-6">
                <button
                    onClick={generateGrid}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Reset Game
                </button>
                <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                    {showSolution ? 'Hide Solution' : 'Show Solution'}
                </button>
            </div>
        </div>
    );
}
