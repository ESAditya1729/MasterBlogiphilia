// GenreSelector.js
import React, { useState } from 'react';

const GenreDropdown = ({ onSelect }) => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [isOpen, setIsOpen] = useState(false);

  const genres = ['All', 'Technology', 'Travel', 'Food', 'Lifestyle', 'Fashion'];

  const handleSelect = (genre) => {
    setSelectedGenre(genre);
    setIsOpen(false);
    if (onSelect) onSelect(genre);
  };

  return (
    <div className="relative mt-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-left flex justify-between items-center"
      >
        {selectedGenre}
        <span className="ml-2">▾</span>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleSelect(genre)}
              className={`block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                selectedGenre === genre ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenreDropdown;