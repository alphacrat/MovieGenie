import React from 'react';
import Navbar from './Navbar';
import Search from './Search';
import Spinner from './Spinner';
import MovieCard from './MovieCard';
import MovieQuizModal from './Quiz';
import Recommendations from './Recommendation';
import GenreSuccessModal from './Success';

const MovieContent = ({
    user,
    onLogout,
    isModalOpen,
    setIsModalOpen,
    showSuccessModal,
    setShowSuccessModal,
    showRecommendations,
    genres,
    handleBackToHome,
    quizGenres,
    handleGenresFound,
    handleShowRecommendations,
    handleSearch,
    isSearching,
    searchQuery,
    isLoading,
    errorMessage,
    trendingMovieList,
    currentGenre,
    movieList
}) => {
    if (showRecommendations) {
        return <Recommendations genres={genres} onBackToHome={handleBackToHome} />;
    }

    return (
        <main>
            <img src="./hero-bg.png" alt="Hero BG" className="pattern" />
            <div className="wrapper">
                <header className="relative -top-8 text-center">
                    <Navbar user={user} onLogout={onLogout} />
                    <img src="/public/hero-img.png" alt="Hero Banner" className="-mt-6" />

                    <div className="flex flex-col items-center -mt-8">
                        <h1 className="text-4xl">
                            Find the <span className="text-gradient">perfect movie</span> tailored
                            to your taste!
                        </h1>
                        <h2>Take our <span className="text-gradient">smart quiz</span> or search for any movie you love...</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn-primary mt-10 px-6 py-3 text-lg"
                        >
                            Start Movie Quiz
                        </button>
                    </div>

                    <div className="flex justify-center mt-6">
                        <Search onSearch={handleSearch} />
                    </div>

                    <MovieQuizModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onGenresFound={handleGenresFound}
                    />

                    <GenreSuccessModal
                        isOpen={showSuccessModal}
                        onClose={() => setShowSuccessModal(false)}
                        genres={quizGenres}
                        onShowRecommendations={handleShowRecommendations}
                    />
                </header>

                <section className="trending">
                    <h2 className="mt-4">
                        {isSearching
                            ? `Trending Movies for "${searchQuery}"`
                            : "Trending Movies"}
                    </h2>
                    {isLoading ? (
                        <div className="loading">
                            <Spinner />
                        </div>
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>
                            {trendingMovieList.map((movie, index) => (
                                <li key={movie.id}>
                                    <p>{index + 1}</p>
                                    <img src={movie.poster_path} alt={movie.title} />
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="all-movies">
                    <h2 className="mt-4">
                        {currentGenre
                            ? 'Recommended Movies'
                            : isSearching
                                ? `Results for "${searchQuery}"`
                                : 'Popular Movies'}
                    </h2>
                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {movieList.map(movie => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
};

export default MovieContent;