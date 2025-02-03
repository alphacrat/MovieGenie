import { useState } from 'react';
import { API_BASE_URL, API_OPTIONS } from '../constants/config';
import { getImageUrl } from '../constants/config';

const BACKEND_API = import.meta.env.VITE_BACKEND_URL

export const useMovies = () => {
    const [movieList, setMovieList] = useState([]);
    const [trendingMovieList, setTrendingMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentGenre, setCurrentGenre] = useState(null);

    const searchLocalMovies = async (query) => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const response = await fetch(
                `${BACKEND_API}/api/v1/movie/search?query=${encodeURIComponent(query)}`,
                { credentials: 'include' }
            );

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const processedMovies = data.map(movie => ({
                id: movie.id,
                title: movie.title,
                poster_path: movie.posterPath ? getImageUrl(movie.posterPath) : './No-Poster.png',
                vote_average: movie.vote_average,
                release_date: movie.releaseDate,
                overview: movie.overview,
                language: movie.original_language

            }));

            setMovieList(processedMovies);
            setCurrentGenre(null);
        } catch (error) {
            console.error('Error searching movies:', error);
            setErrorMessage("Failed to search movies");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTrendingMovies = async (search = '') => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            let url = search
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(search)}&sort_by=popularity.desc&language=en-US`
                : `${API_BASE_URL}/trending/movie/week?language=en-US`;

            const response = await fetch(url, API_OPTIONS);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const processedMovies = data.results
                .slice(0, 6)
                .map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    poster_path: getImageUrl(movie.poster_path),
                    vote_average: movie.vote_average,
                    release_date: movie.release_date,
                    overview: movie.overview,
                    language: movie.original_language
                }));
            setTrendingMovieList(processedMovies);
        } catch (error) {
            console.error('Error fetching trending movies:', error);
            setErrorMessage("Failed to fetch trending movies");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMoviesByGenre = async (genreId) => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const response = await fetch(
                `${API_BASE_URL}/discover/movie?with_genres=${genreId}&language=en-US&sort_by=popularity.desc&include_adult=false&page=1`,
                API_OPTIONS
            );
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const processedMovies = data.results.map(movie => ({
                id: movie.id,
                title: movie.title,
                poster_path: getImageUrl(movie.poster_path),
                vote_average: movie.vote_average,
                release_date: movie.release_date,
                overview: movie.overview
            }));
            setMovieList(processedMovies);
            setCurrentGenre(genreId);
        } catch (error) {
            console.error('Error fetching movies by genre:', error);
            setErrorMessage("Failed to fetch movies");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMovies = async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const response = await fetch(
                `${API_BASE_URL}/discover/movie?language=en-US&sort_by=popularity.desc&include_adult=false&page=1`,
                API_OPTIONS
            );
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const processedMovies = data.results.map(movie => ({
                id: movie.id,
                title: movie.title,
                poster_path: getImageUrl(movie.poster_path),
                vote_average: movie.vote_average,
                release_date: movie.release_date,
                overview: movie.overview
            }));
            setMovieList(processedMovies);
            setCurrentGenre(null);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setErrorMessage("Failed to fetch movies");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        movieList,
        trendingMovieList,
        isLoading,
        errorMessage,
        currentGenre,
        searchLocalMovies,
        fetchTrendingMovies,
        fetchMoviesByGenre,
        fetchMovies
    };
};
