import { useState, useEffect } from 'react';
import MovieDetailsModal from '../pages/MovieDetails';
import { Heart } from 'lucide-react';

const BACKEND_API = import.meta.env.VITE_BACKEND_URL

const MovieCard = ({ movie, onGenresUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recommendedGenres, setRecommendedGenres] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        id,
        title,
        vote_average,
        poster_path,
        release_date,
        language
    } = movie;

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_API}/api/v1/movie/saved`,
                    {
                        credentials: 'include',
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    if (data.movieIds && Array.isArray(data.movieIds)) {
                        const isMovieSaved = data.movieIds.includes(id);
                        setIsFavorite(isMovieSaved);
                    } else {
                        console.error('Expected movieIds array but received:', data);
                        setIsFavorite(false);
                    }
                }
            } catch (error) {
                console.error('Error checking favorite status:', error);
                setIsFavorite(false);
            }
        };

        checkFavoriteStatus();
    }, [id]);

    const handleClick = () => {
        setIsModalOpen(true);
    };

    const handleGenresFound = (genres) => {
        setRecommendedGenres(genres);
        if (onGenresUpdate) {
            onGenresUpdate(genres);
        }
    };

    const handleFavoriteClick = async (e) => {
        e.stopPropagation();
        if (isLoading) return;

        setIsLoading(true);
        const newFavoriteStatus = !isFavorite;
        setIsFavorite(newFavoriteStatus);

        try {
            const response = await fetch(
                `${BACKEND_API}/api/v1/movie/${newFavoriteStatus ? 'favorite' : 'delete'}?movieId=${id}`,
                {
                    method: newFavoriteStatus ? 'POST' : 'DELETE',
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                console.error('Failed to update favorite status');
                setIsFavorite(!newFavoriteStatus);
            }
        } catch (error) {
            console.error('Error updating favorite status:', error);
            setIsFavorite(!newFavoriteStatus);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="movie-card relative cursor-pointer hover:scale-105 transition-all duration-200" onClick={handleClick}>
                <button
                    onClick={handleFavoriteClick}
                    disabled={isLoading}
                    className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200"
                >
                    <Heart
                        className={`w-5 h-5 ${isFavorite
                            ? 'text-red-500 fill-current'
                            : 'text-white'
                            }`}
                    />
                </button>

                <img
                    src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : './No-Poster.png'}
                    alt={title}
                    className="w-full rounded-lg shadow-lg"
                />
                <div className="mt-4">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <div className="content flex items-center gap-2 mt-2">
                        <div className="rating flex items-center gap-1">
                            <img src="./Rating.svg" alt="star" className="w-4 h-4" />
                            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                        </div>
                        <span>•</span>
                        <p className="year">{release_date ? release_date.slice(0, 4) : 'N/A'}</p>
                        <span>•</span>
                        <p className="lang">{language ? language.toUpperCase() : 'N/A'}</p>
                    </div>
                </div>
            </div>
            <MovieDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                movieId={id}
                onGenresFound={handleGenresFound}
            />
        </>
    );
};

export default MovieCard;