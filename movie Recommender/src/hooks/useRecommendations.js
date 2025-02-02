import { useState, useEffect } from 'react';

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

export const useRecommendations = (genres) => {
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

    useEffect(() => {
        const fetchGenreNames = async () => {
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

    return {
        moviesByGenre,
        isLoading,
        loadingMore,
        errorMessage,
        genreNames,
        loadMoreMovies
    };
};