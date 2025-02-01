import React, { useState } from 'react';

const Search = ({ onSearch }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = () => {
        if (inputValue.trim()) {
            onSearch(inputValue);
        }
    };

    return (
        <div className="search">
            <div className="flex items-center">
                <img src="./search.svg" alt="searchIcon" />
                <input
                    type="text"
                    placeholder="Search by title, genre, director, or more..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="search-input"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSubmit();
                        }
                    }}
                />
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-3xl ml-2"
                >
                    Search
                </button>
            </div>
        </div>
    );
};

export default Search;