import React, { useState, useEffect } from 'react';
import { Home, Plus } from 'lucide-react';
import Navbar from './Navbar';
import MovieCard from './MovieCard';
import Spinner from './Spinner';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
};

const Recommendations = ({ genres, onBackToHome }) => {
    const [moviesByGenre, setMoviesByGenre] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [genreNames, setGenreNames] = useState({});
    const [pagesByGenre, setPagesByGenre] = useState({});

    const getImageUrl = (path, size = 'w500') => {
        if (!path) return './No-Poster.png';
        return `${IMAGE_BASE_URL}/${size}${path}`;
    };

    useEffect(() => {
        const fetchGenreNames = async () => {
            console.log('Fetching genre names for:', genres);
            if (!genres || !genres.every(id => Number.isInteger(id))) {
                setErrorMessage('Invalid genre IDs received');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${API_BASE_URL}/genre/movie/list`,
                    API_OPTIONS
                );
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                const genreMap = {};
                data.genres.forEach(genre => {
                    genreMap[genre.id] = genre.name;
                });
                console.log('Genre names fetched:', genreMap);
                setGenreNames(genreMap);

                const initialPages = {};
                genres.forEach(genreId => {
                    initialPages[genreId] = 1;
                });
                setPagesByGenre(initialPages);

                await fetchAllRecommendations();
            } catch (error) {
                console.error('Error fetching genre names:', error);
                setErrorMessage('Failed to load genre information');
                setIsLoading(false);
            }
        };

        if (genres && genres.length > 0) {
            fetchGenreNames();
        } else {
            setIsLoading(false);
        }
    }, [genres]);

    const fetchMoviesForGenre = async (genreId, page = 1) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/discover/movie?with_genres=${genreId}&language=en-US&sort_by=popularity.desc&include_adult=false&page=${page}`,
                API_OPTIONS
            );
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const processedMovies = data.results.slice(0, 4).map(movie => ({
                id: movie.id,
                title: movie.title,
                poster_path: getImageUrl(movie.poster_path),
                vote_average: movie.vote_average,
                release_date: movie.release_date,
                overview: movie.overview
            }));

            return processedMovies;
        } catch (error) {
            console.error(`Error fetching movies for genre ${genreId}:`, error);
            return [];
        }
    };

    const fetchAllRecommendations = async () => {
        try {
            const moviesData = {};
            await Promise.all(
                genres.map(async (genreId) => {
                    const movies = await fetchMoviesForGenre(genreId);
                    moviesData[genreId] = movies;
                })
            );
            setMoviesByGenre(moviesData);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setErrorMessage('Failed to fetch movie recommendations');
        } finally {
            setIsLoading(false);
        }
    };

    const loadMoreMovies = async (genreId) => {
        setLoadingMore(prev => ({ ...prev, [genreId]: true }));
        try {
            const nextPage = pagesByGenre[genreId] + 1;
            const newMovies = await fetchMoviesForGenre(genreId, nextPage);

            setMoviesByGenre(prev => ({
                ...prev,
                [genreId]: [...(prev[genreId] || []), ...newMovies]
            }));

            setPagesByGenre(prev => ({
                ...prev,
                [genreId]: nextPage
            }));
        } catch (error) {
            console.error(`Error loading more movies for genre ${genreId}:`, error);
        } finally {
            setLoadingMore(prev => ({ ...prev, [genreId]: false }));
        }
    };

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