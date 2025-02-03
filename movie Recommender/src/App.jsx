import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useMovies } from './hooks/useMovies';
import MovieContent from './components/MovieContent';
import AuthPage from './pages/Auth';
import Favourites from './pages/Favourites';
import { GENRE_NAME_TO_ID } from './constants/config';

const App = () => {
  const { user, errorMessage: authError, handleLogout } = useAuth();
  const {
    movieList,
    trendingMovieList,
    isLoading,
    errorMessage: movieError,
    currentGenre,
    searchLocalMovies,
    fetchTrendingMovies,
    fetchMoviesByGenre,
    fetchMovies
  } = useMovies();

  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [genres, setGenres] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [quizGenres, setQuizGenres] = useState([]);

  const handleSearch = (query) => {
    if (query.trim()) {
      setIsSearching(true);
      setSearchQuery(query);
      searchLocalMovies(query);
      fetchTrendingMovies(query);
    } else {
      setIsSearching(false);
      setSearchQuery('');
      fetchMovies();
      fetchTrendingMovies();
    }
  };

  const handleGenresFound = (newGenres) => {
    const genreIds = newGenres.map(genreName => {
      const id = GENRE_NAME_TO_ID[genreName];
      if (!id) {
        console.warn(`No ID found for genre: ${genreName}`);
      }
      return id;
    }).filter(id => id !== undefined);

    if (genreIds.length > 0) {
      setQuizGenres(genreIds);
      setIsModalOpen(false);
      setShowSuccessModal(true);
    }
  };

  const handleShowRecommendations = () => {
    setGenres(quizGenres);
    setShowSuccessModal(false);
    setShowRecommendations(true);
  };

  const handleBackToHome = () => {
    setShowRecommendations(false);
    setGenres([]);
    setQuizGenres([]);
  };

  useEffect(() => {
    if (!showRecommendations && !isSearching) {
      fetchTrendingMovies();
      fetchMovies();
    }
  }, [showRecommendations, isSearching]);

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <MovieContent
            user={user}
            onLogout={handleLogout}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            showSuccessModal={showSuccessModal}
            setShowSuccessModal={setShowSuccessModal}
            showRecommendations={showRecommendations}
            genres={genres}
            handleBackToHome={handleBackToHome}
            quizGenres={quizGenres}
            handleGenresFound={handleGenresFound}
            handleShowRecommendations={handleShowRecommendations}
            handleSearch={handleSearch}
            isSearching={isSearching}
            searchQuery={searchQuery}
            isLoading={isLoading}
            errorMessage={movieError || authError}
            trendingMovieList={trendingMovieList}
            currentGenre={currentGenre}
            movieList={movieList}
          />
        }
      />
      <Route path="/favorites" element={<Favourites />} />
    </Routes>
  );
};

export default App;