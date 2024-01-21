// Favorites.tsx
import React, { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { XIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/solid';
import {
  removeFromFavorites,
  getFavorites,
  addToFavorites as addToFavoritesStorage,
  getFavoriteReason,
  addFavoriteReason,
  removeFavoriteReason,
} from './storage';

const Favorites = () => {
  const [removeConfirmation, setRemoveConfirmation] = useState<string | null>(null);
  const [editPackage, setEditPackage] = useState<string | null>(null);
  const [editedReason, setEditedReason] = useState<string>('');
  const [viewReasonPackage, setViewReasonPackage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const favorites: string[] = getFavorites();

  const removeFromFavoritesHandler = (packageName: string) => {
    setRemoveConfirmation(packageName);
  };

  const editFavoriteReason = (packageName: string) => {
    setEditPackage(packageName);
    setEditedReason(getFavoriteReason(packageName) || '');
  };

  const saveEditedReason = () => {
    if (editPackage) {
      addFavoriteReason(editPackage, editedReason);
      queryClient.invalidateQueries('favorites');
      setEditPackage(null);
    }
  };

  const viewFavoriteReason = (packageName: string) => {
    setViewReasonPackage(packageName);
  };

  const confirmRemoveFromFavorites = async () => {
    try {
      if (removeConfirmation) {
        const confirmation = window.confirm(`Remove ${removeConfirmation} from favorites?`);

        if (confirmation) {
          removeFromFavorites(removeConfirmation);
          removeFavoriteReason(removeConfirmation);
          queryClient.invalidateQueries('favorites');
          setRemoveConfirmation(null);
        }
      }
    } catch (error) {
      console.error('Error confirming remove from favorites:', error);
    }
  };

  useEffect(() => {
    const fetchFavoriteReasons = async () => {
      for (const packageName of favorites) {
        const reason = await getFavoriteReason(packageName);
        console.log(`Reason for ${packageName}: ${reason}`);
      }
    };

    fetchFavoriteReasons();
  }, [favorites]);

  return (
    <div>
      <h2 className="text-4xl font-bold mb-8 text-center text-blue-500">Your Favorites</h2>
      {favorites.length === 0 && <p className="text-center text-gray-500">No favorites yet.</p>}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {favorites.map((packageName) => (
          <div key={packageName} className="p-6 bg-white rounded-md shadow-md">
            <h3 className="text-lg font-bold mb-2">{packageName}</h3>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {editPackage === packageName ? (
                  <>
                    <button
                      onClick={saveEditedReason}
                      className="text-green-500"
                      title="Save"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setEditPackage(null)}
                      className="text-gray-500"
                      title="Cancel"
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => editFavoriteReason(packageName)}
                      className="text-blue-500"
                      title="Edit Reason"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => removeFromFavoritesHandler(packageName)}
                      className="text-red-500"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => viewFavoriteReason(packageName)}
                      className="text-purple-500"
                      title="View Reason"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {removeConfirmation && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-70 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md shadow-md">
            <p>
              Are you sure you want to remove {removeConfirmation} from favorites?
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={confirmRemoveFromFavorites}
              >
                Remove
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => setRemoveConfirmation(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {editPackage && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-70 flex justify-center items-center">
          <div className="bg-white p-8 rounded-md shadow-md">
            <p className="text-xl font-bold mb-4">Edit Reason for {editPackage}</p>
            <textarea
              className="w-full h-32 p-2 border rounded-md mb-4"
              value={editedReason}
              onChange={(e) => setEditedReason(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={saveEditedReason}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {viewReasonPackage && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-70 flex justify-center items-center">
          <div className="bg-white p-8 rounded-md shadow-md">
            <p className="text-xl font-bold mb-4">Reason for {viewReasonPackage}</p>
            <p>{getFavoriteReason(viewReasonPackage)}</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded-md"
                onClick={() => setViewReasonPackage(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
