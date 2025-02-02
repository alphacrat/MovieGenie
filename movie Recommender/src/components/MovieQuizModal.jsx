import React from 'react';
import { useMovieQuiz } from '../hooks/useMovieQuiz.js';

const MovieQuizModal = ({ isOpen, onClose, onGenresFound }) => {
    const {
        questions,
        loading,
        error,
        loadingMessage,
        userAnswers,
        handleAnswerSelect,
        areAllQuestionsAnswered,
        getGenreRecommendations,
        generateQuestions
    } = useMovieQuiz({ isOpen, onClose, onGenresFound });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-primary/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-dark-100 p-8 rounded-2xl max-w-2xl w-full mx-4 shadow-xl shadow-light-100/10">
                <h2 className="text-2xl font-bold mb-6">AI-Powered Movie Genre Prediction Quiz</h2>

                {loading && (
                    <div className="text-center py-6">
                        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-light-200 text-lg mb-2">{loadingMessage}</p>
                        <p className="text-light-200/60 text-sm">
                            Our AI is preparing a unique quiz based on advanced movie analysis
                        </p>
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