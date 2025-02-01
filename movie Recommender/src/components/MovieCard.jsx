import { useState, useEffect } from 'react';
import MovieDetailsModal from '../pages/MovieDetails';
import { Heart } from 'lucide-react';

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
        original_language
    } = movie;

    // Check if movie is already favorited on component mount
    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                const response = await fetch(
                    'https://moviegenie-backend-alphacrat.onrender.com/api/v1/movie/saved',
                    {
                        credentials: 'include',
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    // Check if movieIds exists and is an array
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
        setIsLoading(true);
        try {
            let response;
            if (isFavorite) {
                // Remove from favorites
                response = await fetch(
                    `http://localhost:8000/api/v1/movie/delete?movieId=${id}`,
                    {
                        method: 'DELETE',
                        credentials: 'include',
                    }
                );
            } else {
                // Add to favorites
                response = await fetch(
                    `http://localhost:8000/api/v1/movie/favorite?movieId=${id}`,
                    {
                        method: 'POST',
                        credentials: 'include',
                    }
                );
            }

            if (response.ok) {
                setIsFavorite(!isFavorite);
            } else {
                console.error('Failed to update favorite status');
            }
        } catch (error) {
            console.error('Error updating favorite status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="movie-card relative cursor-pointer hover:scale-105 transition-all duration-200" onClick={handleClick}>
                {/* Favorite Button */}
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
                        <p className="lang">{original_language ? original_language.toUpperCase() : 'N/A'}</p>
                    </div>
                    {recommendedGenres.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {recommendedGenres.map((genre, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    )}
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