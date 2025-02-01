import React from 'react';
import { PartyPopper, X } from "lucide-react";

const GENRE_NAME_TO_ID = {
    'Action': 28,
    'Adventure': 12,
    'Animation': 16,
    'Comedy': 35,
    'Crime': 80,
    'Documentary': 99,
    'Drama': 18,
    'Family': 10751,
    'Fantasy': 14,
    'History': 36,
    'Horror': 27,
    'Music': 10402,
    'Mystery': 9648,
    'Romance': 10749,
    'Science Fiction': 878,
    'Thriller': 53,
    'War': 10752,
    'Western': 37,
    'Psychological Thriller': 53,
    'Coming-of-Age': 18,
    'Uplifting Drama': 18,
    'Inspirational': 18,
    'Feel-Good': 35,
    'Historical Drama': 36,
    'Biography': 99,
    'TV Movie': 10770,
    'Foreign': 10769,
    'Independent': 10756,
    'Documentary Film': 99
};

const GenreSuccessModal = ({
    isOpen,
    onClose,
    genres,
    onShowRecommendations
}) => {
    if (!isOpen) return null;

    const getGenreNames = (genreIds) => {
        const idToName = Object.fromEntries(
            Object.entries(GENRE_NAME_TO_ID).map(([name, id]) => [id, name])
        );
        return genreIds.map(id => idToName[id]).filter(Boolean);
    };

    const genreNames = getGenreNames(genres);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl max-w-2xl w-full p-8 relative shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="bg-yellow-500/10 p-3 rounded-2xl">
                            <PartyPopper className="h-8 w-8 text-yellow-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">
                            Your Movie Interests!
                        </h2>
                    </div>

                    <div className="space-y-6">
                        <p className="text-lg text-gray-600">
                            Based on your responses, you seem to enjoy:
                        </p>
                        <div className="min-h-40 flex flex-wrap gap-3 justify-center items-start p-6 bg-white/50 rounded-2xl shadow-inner">
                            {genreNames.map((genre, index) => (
                                <span
                                    key={index}
                                    className="bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-purple-500/20 
                                             text-gray-700 px-6 py-3 rounded-full font-medium text-base
                                             hover:from-purple-500/10 hover:to-blue-500/10 transition-all
                                             cursor-default shadow-sm"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-center">
                    <button
                        onClick={onShowRecommendations}
                        className="group px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 
                                 text-white font-medium text-base transition-all duration-300 
                                 hover:from-purple-500 hover:to-blue-500 hover:scale-[1.02] 
                                 active:scale-[0.98] shadow-lg"
                    >
                        See Your Recommendations
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenreSuccessModal;