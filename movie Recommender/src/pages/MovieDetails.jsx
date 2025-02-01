import { useState, useEffect } from "react";
import { Play, X } from "lucide-react";

const API_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const genreColors = {
    Action: "bg-amber-200 text-amber-800",
    Comedy: "bg-pink-200 text-pink-800",
    Drama: "bg-blue-200 text-blue-800",
    Horror: "bg-purple-200 text-purple-800",
    Romance: "bg-red-200 text-red-800",
    "Science Fiction": "bg-cyan-200 text-cyan-800",
    Documentary: "bg-green-200 text-green-800",
    Fantasy: "bg-indigo-200 text-indigo-800",
    Animation: "bg-orange-200 text-orange-800",
    Thriller: "bg-slate-200 text-slate-800",
    default: "bg-gray-200 text-gray-800"
};

const DetailItem = ({ label, value }) => {
    const getBackgroundColor = (label) => {
        switch (label) {
            case 'Director':
                return 'bg-gradient-to-r from-purple-500/20 to-indigo-600/20';
            case 'Cast':
                return 'bg-gradient-to-r from-pink-500/20 to-rose-500/20';
            case 'Status':
                return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20';
            case 'Production':
                return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20';
            case 'Countries':
                return 'bg-gradient-to-r from-amber-500/20 to-orange-500/20';
            case 'Languages':
                return 'bg-gradient-to-r from-red-500/20 to-pink-500/20';
            default:
                return 'bg-light-100/5';
        }
    };

    return (
        <div className={`${getBackgroundColor(label)} p-4 rounded-lg hover:bg-light-100/10 transition-colors backdrop-blur-sm shadow-inner shadow-light-100/5`}>
            <span className="text-gray-100 text-sm block mb-2">{label}</span>
            <span className="text-light-100 font-medium">{value || "N/A"}</span>
        </div>
    );
};

const MovieDetailsModal = ({ isOpen, onClose, movieId }) => {
    const [movie, setMovie] = useState(null);
    const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            if (!movieId) return;

            const response = await fetch(
                `${API_BASE_URL}/movie/${movieId}?append_to_response=videos,credits,watch/providers&language=en-US`,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${API_KEY}`,
                    },
                }
            );
            const data = await response.json();
            setMovie(data);
        };

        if (isOpen) {
            fetchMovieDetails();
        }
    }, [movieId, isOpen]);

    const getGenreColor = (genreName) => {
        return genreColors[genreName] || genreColors.default;
    };

    if (!isOpen) return null;

    const trailer = movie?.videos?.results?.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
    );

    const director = movie?.credits?.crew?.find((person) => person.job === "Director")?.name || "N/A";
    const cast = movie?.credits?.cast?.slice(0, 5).map((actor) => actor.name).join(", ") || "N/A";
    const watchProviders = movie?.["watch/providers"]?.results?.US?.flatrate || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
            <div className="fixed inset-0 bg-primary/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-6xl mx-4 my-8">
                {!movie ? (
                    <div className="bg-dark-100 rounded-2xl p-8 text-center text-light-100">
                        Loading...
                    </div>
                ) : (
                    <div className="bg-dark-100 rounded-2xl shadow-inner shadow-light-100/10 p-8 relative">
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-light-100/10 text-light-100"
                        >
                            <X size={24} />
                        </button>

                        {/* Watch Button */}
                        <button
                            onClick={() => setIsWatchModalOpen(true)}
                            className="btn-primary absolute top-6 right-16 flex items-center gap-2 px-4 py-2 text-sm"
                        >
                            <Play size={16} />
                            Watch Now
                        </button>

                        {/* Title Section */}
                        <div className="mb-6">
                            <div className="flex items-center flex-wrap gap-4">
                                <div className="flex items-center gap-4 ml-2">
                                    <h2 className="text-light-100">{movie.title}</h2>
                                    <span className="text-gray-100">• {movie.release_date?.split('-')[0]}</span>
                                    <span className="text-gray-100">• {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {movie.genres?.map((genre) => (
                                        <span
                                            key={genre.id}
                                            className={`px-4 py-1 rounded-lg text-sm font-medium ${getGenreColor(genre.name)}`}
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Media Section */}
                        <div className="flex flex-col md:flex-row gap-6 mb-8">
                            {/* Poster */}
                            <div className="w-full md:w-[300px] flex-shrink-0">
                                <img
                                    src={`${IMAGE_BASE_URL}/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-full h-[450px] object-cover rounded-lg"
                                />
                            </div>

                            {/* Trailer */}
                            {trailer && (
                                <div className="flex-grow h-[450px] rounded-lg overflow-hidden bg-light-100/5">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${trailer.key}`}
                                        title={`${movie.title} Trailer`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Overview Section */}
                        <div className="mb-8">
                            <h2 className="mb-4 text-light-100">Overview</h2>
                            <p className="text-light-200 leading-relaxed">{movie.overview}</p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <DetailItem label="Director" value={director} />
                            <DetailItem label="Cast" value={cast} />
                            <DetailItem label="Status" value={movie.status} />
                            <DetailItem label="Production" value={movie.production_companies?.[0]?.name} />
                            <DetailItem label="Countries" value={movie.production_countries?.map(c => c.name).join(' • ')} />
                            <DetailItem label="Languages" value={movie.spoken_languages?.map(l => l.english_name).join(' • ')} />
                        </div>

                        {/* Watch Providers Modal */}
                        {isWatchModalOpen && (
                            <div className="fixed inset-0 bg-primary/80 flex items-center justify-center z-50">
                                <div className="bg-dark-100 p-8 rounded-2xl shadow-inner shadow-light-100/10 max-w-lg w-full mx-4">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-light-100">Watch on</h2>
                                        <button
                                            onClick={() => setIsWatchModalOpen(false)}
                                            className="text-light-200 hover:text-light-100"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    {watchProviders.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {watchProviders.map((provider) => (
                                                <a
                                                    key={provider.provider_id}
                                                    href={movie["watch/providers"].results?.US?.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-light-100/5 hover:bg-light-100/10 p-4 rounded-lg flex flex-col items-center gap-2 transition-colors"
                                                >
                                                    <img
                                                        src={`${IMAGE_BASE_URL}/original${provider.logo_path}`}
                                                        alt={provider.provider_name}
                                                        className="w-12 h-12 rounded-lg"
                                                    />
                                                    <span className="text-sm text-center text-light-100">
                                                        {provider.provider_name}
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-light-200 text-center">
                                            No streaming providers available at this time.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieDetailsModal;