import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Spinner from '../constants/Spinner';

const BACKEND_API = import.meta.env.VITE_BACKEND_URL

const Favorites = () => {
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const fetchFavorites = async () => {
        try {
            const savedResponse = await fetch(`${BACKEND_API}/api/v1/movie/saved`, {
                credentials: 'include',
            });

            if (!savedResponse.ok) {
                throw new Error('Failed to fetch saved movies');
            }

            const savedData = await savedResponse.json();

            if (!savedData.movieIds || !Array.isArray(savedData.movieIds)) {
                setFavoriteMovies([]);
                setIsLoading(false);
                return;
            }

            const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
            const API_OPTIONS = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${API_KEY}`
                }
            };

            const moviePromises = savedData.movieIds.map(async (movieId) => {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
                    API_OPTIONS
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch movie ${movieId}`);
                }
                return response.json();
            });

            const movies = await Promise.all(moviePromises);
            setFavoriteMovies(movies);
        } catch (err) {
            console.error('Error fetching favorites:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    if (isLoading) {
        return (
            <main>
                <div className="pattern" style={{ backgroundImage: 'var(--background-image-hero-pattern)' }} />
                <div className="wrapper">
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <Spinner />
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main>
                <div className="pattern" style={{ backgroundImage: 'var(--background-image-hero-pattern)' }} />
                <div className="wrapper">
                    <div className="text-center text-red-500">
                        <h2>Error: {error}</h2>
                        <button
                            onClick={() => navigate('/')}
                            className="btn-primary mt-4"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className="pattern" style={{ backgroundImage: 'var(--background-image-hero-pattern)' }} />
            <div className="wrapper">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-gradient text-3xl font-bold">My Favorites</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-primary flex items-center gap-2 !px-4 !py-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Home
                    </button>
                </div>

                <section className="all-movies">
                    {favoriteMovies.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                            <h2 className="text-gradient text-2xl font-bold mb-4">No favorite movies yet</h2>
                            <p className="text-light-200 mb-6">Start exploring and add movies to your favorites!</p>
                            <button
                                onClick={() => navigate('/')}
                                className="btn-primary"
                            >
                                Explore Movies
                            </button>
                        </div>
                    ) : (
                        <ul className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {favoriteMovies.map((movie) => (
                                <li key={movie.id} >
                                    <MovieCard movie={movie} onGenresUpdate={() => { }} />
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Favorites;