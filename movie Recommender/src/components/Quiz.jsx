import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const MovieQuizModal = ({ isOpen, onClose, onGenresFound }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});

    const extractJSON = useCallback((text) => {
        try {
            return JSON.parse(text);
        } catch (e) {
            const cleanedText = text
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();
            return JSON.parse(cleanedText);
        }
    }, []);

    const validateQuestions = useCallback((parsedQuestions) => {
        return Array.isArray(parsedQuestions) &&
            parsedQuestions.length === 3 &&
            parsedQuestions.every(q =>
                q.id &&
                typeof q.question === 'string' &&
                Array.isArray(q.options) &&
                q.options.length === 3 &&
                q.options.every(opt => typeof opt === 'string')
            );
    }, []);

    const generateQuestions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `Generate exactly 3 questions to understand user's movie preferences.
                Each question must have exactly 3 options. 
                Possible question topics:
                - Story structures
                - Visual styles
                - Historical settings
                - Mood/tone preferences
                - Pacing styles
                - Conflict types
                - Director approaches
                Return ONLY a JSON array with this exact structure (no additional text or formatting):
                [
                    {
                        "id": 1,
                        "question": "Sample question 1",
                        "options": ["Option 1", "Option 2", "Option 3"]
                    },
                    {
                        "id": 2,
                        "question": "Different aspect question?",
                        "options": ["Choice A", "Choice B", "Choice C"]
                    },
                    {
                        "id": 3,
                        "question": "Another unique question?",
                        "options": ["Variation X", "Variation Y", "Variation Z"]
                    }
                ]`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            console.log('Raw API response:', text);
            const parsedQuestions = extractJSON(text);
            console.log('Parsed questions:', parsedQuestions);

            if (!validateQuestions(parsedQuestions)) {
                throw new Error('Invalid question format received');
            }

            setQuestions(parsedQuestions);
        } catch (error) {
            console.error("Error generating questions:", error);
            setError(error.message || "Failed to generate questions. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [extractJSON, validateQuestions]);

    // Rest of the component remains the same...
    const getGenreRecommendations = async () => {
        try {
            setLoading(true);

            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const answerSummary = questions.map(q => (
                `Question: ${q.question}\nChosen Answer: ${userAnswers[q.id]}`
            )).join('\n\n');

            const prompt = `Based on these movie preferences:
                ${answerSummary}
                Return ONLY a JSON array with exactly 3 movie genres (no markdown, no backticks) like this:
                ["Primary Genre", "Secondary Genre", "Tertiary Genre"]
                Strictly return any of the following genres as given in the list : 
                'Action'
                'Adventure'
                'Animation'
                'Comedy'
                'Crime'
                'Documentary',
                'Drama'
                'Family'
                'Fantasy'
                'History'
                'Horror'
                'Music'
                'Mystery'
                'Romance'
                'Science Fiction'
                'Thriller'
                'War'
                'Western'
                'Psychological Thriller'
                'Coming-of-Age'
                'Uplifting Drama' 
                'Inspirational' 
                'Feel-Good' 
                'Historical Drama'
                'Biography'
                'TV Movie'
                'Foreign'
                'Independent'
                'Documentary Film'
                Ensure the response is a valid JSON array with exactly 3 string elements.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const genres = extractJSON(text);

            if (!Array.isArray(genres) || genres.length !== 3 || !genres.every(g => typeof g === 'string')) {
                throw new Error('Invalid genre format received');
            }

            onGenresFound(genres);
            onClose();
        } catch (error) {
            console.error("Error generating genre recommendations:", error);
            setError("Failed to generate recommendations. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId, answer) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const areAllQuestionsAnswered = () => {
        return questions.length > 0 &&
            questions.every(q => userAnswers[q.id] !== undefined);
    };

    useEffect(() => {
        if (isOpen) {
            setQuestions([]);
            setUserAnswers({});
            generateQuestions();
        }
    }, [isOpen, generateQuestions]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-primary/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-dark-100 p-8 rounded-2xl max-w-2xl w-full mx-4 shadow-xl shadow-light-100/10">
                <h2 className="text-2xl font-bold mb-6">Movie Preference Quiz</h2>

                {loading && (
                    <div className="text-center py-6">
                        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                        <p className="text-light-200">Loading...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
                        {error}
                        <button
                            onClick={() => {
                                setError(null);
                                generateQuestions();
                            }}
                            className="ml-4 underline hover:text-red-300"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && questions.map(q => (
                    <div key={q.id} className="mb-8">
                        <p className="text-white font-bold text-lg mb-4">
                            Q{q.id}: {q.question}
                        </p>
                        <div className="space-y-3">
                            {q.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(q.id, option)}
                                    className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${userAnswers[q.id] === option
                                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                                        : 'bg-light-100/5 hover:bg-light-100/10 text-light-200'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="flex justify-end gap-4 mt-8">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 border border-light-100/20 rounded-lg text-light-200 hover:bg-light-100/5 transition-all duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={getGenreRecommendations}
                        disabled={!areAllQuestionsAnswered() || loading}
                        className={`px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90 transition-all duration-300 ${!areAllQuestionsAnswered() || loading
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                            }`}
                    >
                        Find My Genres
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MovieQuizModal;