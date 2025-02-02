import { useState, useEffect, useCallback } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const useMovieQuiz = ({ isOpen, onClose, onGenresFound }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [loadingMessage, setLoadingMessage] = useState('');

    const loadingMessages = [
        "AI is analyzing movie patterns...",
        "Crafting personalized questions...",
        "Training neural networks for your preferences...",
        "Preparing an AI-powered movie quiz just for you...",
        "Connecting to our intelligent recommendation system...",
        "Processing cinematic data for optimal questions..."
    ];

    useEffect(() => {
        let messageInterval;
        if (loading) {
            let currentIndex = 0;
            setLoadingMessage(loadingMessages[0]);

            messageInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[currentIndex]);
            }, 2500);
        }

        return () => {
            if (messageInterval) {
                clearInterval(messageInterval);
            }
        };
    }, [loading]);

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

            const parsedQuestions = extractJSON(text);

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
                'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
                'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music',
                'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War',
                'Western', 'Psychological Thriller', 'Coming-of-Age', 'Uplifting Drama',
                'Inspirational', 'Feel-Good', 'Historical Drama', 'Biography',
                'TV Movie', 'Foreign', 'Independent', 'Documentary Film'
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

    return {
        questions,
        loading,
        error,
        loadingMessage,
        userAnswers,
        handleAnswerSelect,
        areAllQuestionsAnswered,
        getGenreRecommendations,
        generateQuestions
    };
};