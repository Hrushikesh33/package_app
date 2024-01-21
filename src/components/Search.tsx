import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { getFavorites, addToFavorites as addToFavoritesStorage } from './storage';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [favoriteReason, setFavoriteReason] = useState('');
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);

  const { data, isLoading, isError } = useQuery(
    ['search', searchTerm],
    () => axios.get(`https://api.npms.io/v2/search?q=${searchTerm}`),
    {
      enabled: !!searchTerm,
    }
  );

  const addToFavorites = async (packageName: string) => {
    try {
      const favorites: string[] = getFavorites();
      if (favorites.includes(packageName)) {
        return; // Already in favorites
      }

      // Set the selected package and ask for a reason
      setSelectedPackage(packageName);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const confirmAddToFavorites = async () => {
    try {
      if (selectedPackage) {
        setIsAddingToFavorites(true);

        // Update the favorites list
        addToFavoritesStorage(selectedPackage, favoriteReason); // <-- Include the reason argument
        // For demonstration purposes, you can make an API call to store the favorites on the server
        // Simulating an API call using a timeout
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Clear the selected package and reason
        setSelectedPackage(null);
        setFavoriteReason('');
        setIsAddingToFavorites(false);
      }
    } catch (error) {
      console.error('Error confirming add to favorites:', error);
      setIsAddingToFavorites(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-4xl font-bold mb-8 text-center text-blue-500">Discover NPM Packages</h2>
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search for packages..."
          className="p-4 border border-gray-300 rounded w-full focus:outline-none focus:border-blue-500 text-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="absolute top-0 right-0 m-4 text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6M3 10h16v4H3z" />
          </svg>
        </button>
      </div>

      {isLoading && (
        <div className="text-center text-blue-500 font-semibold text-lg mb-8">Loading...</div>
      )}
      {isError && (
        <div className="text-center text-red-500 font-semibold text-lg mb-8">Error fetching data</div>
      )}

      {data && (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.data.results.map((result: any) => (
            <li key={result.package.name} className="border p-6 rounded-md shadow-lg bg-white">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold mb-2 text-blue-500">{result.package.name}</h3>
                  <p className="text-gray-600">{result.package.description}</p>
                </div>
                <button
                  onClick={() => addToFavorites(result.package.name)}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                  Add to Favorites
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal for adding to favorites with reason */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-70 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md shadow-md">
            <p className="mb-4">
              You've selected {selectedPackage} as a favorite. Please provide a reason:
            </p>
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Enter your reason..."
              value={favoriteReason}
              onChange={(e) => setFavoriteReason(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                onClick={confirmAddToFavorites}
                className={`bg-blue-500 text-white px-4 py-2 rounded mr-2 ${isAddingToFavorites ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 transition duration-300'}`}
                disabled={isAddingToFavorites}
              >
                Add to Favorites
              </button>
              <button
                onClick={() => {
                  setSelectedPackage(null);
                  setFavoriteReason('');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
