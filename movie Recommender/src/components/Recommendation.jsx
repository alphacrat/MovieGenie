import React from 'react';
import { Home, Plus } from 'lucide-react';
import Navbar from './Navbar';
import MovieCard from './MovieCard';
import Spinner from '../constants/Spinner';
import { useRecommendations } from '../hooks/useRecommendations';

const Recommendations = ({ genres, onBackToHome }) => {
    const {
        moviesByGenre,
        isLoading,
        loadingMore,
        errorMessage,
        genreNames,
        loadMoreMovies
    } = useRecommendations(genres);

    return (
        <main>
            <img src="./hero-bg.png" alt="Hero BG" className="pattern" />
            <div className="wrapper">
                <header className="relative -top-8">
                    <Navbar />
                    <div className="text-center mt-12">
                        <h1 className="text-4xl">
                            Your <span className="text-gradient">Personalized</span> Movie Recommendations
                        </h1>
                        <button
                            onClick={onBackToHome}
                            className="btn-primary mt-6 px-4 py-2 flex items-center gap-2 mx-auto"
                        >
                            <Home size={20} />
                            Back to Home
                        </button>
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <Spinner />
                    </div>
                ) : errorMessage ? (
                    <p className="text-red-500 text-center">{errorMessage}</p>
                ) : (
                    <div className="space-y-12 mt-8">
                        {genres.map((genreId) => (
                            <section key={genreId} className="recommendation-section">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">
                                        Best in {genreNames[genreId] || 'Loading...'}
                                    </h2>
                                    <button
                                        onClick={() => loadMoreMovies(genreId)}
                                        disabled={loadingMore[genreId]}
                                        className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                                    >
                                        {loadingMore[genreId] ? (
                                            <Spinner className="w-4 h-4" />
                                        ) : (
                                            <Plus className="w-4 h-4" />
                                        )}
                                        Find More
                                    </button>
                                </div>
                                {moviesByGenre[genreId]?.length > 0 ? (
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {moviesByGenre[genreId]?.map((movie) => (
                                            <MovieCard key={movie.id} movie={movie} />
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-center text-gray-400">No movies found for this genre</p>
                                )}
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Recommendations;