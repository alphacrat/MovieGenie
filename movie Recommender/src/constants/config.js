export const API_BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
};

export const GENRE_NAME_TO_ID = {
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
};

export const getImageUrl = (path, size = 'w500') => {
    if (!path) return './No-Poster.png';
    return `${IMAGE_BASE_URL}/${size}${path}`;
};

