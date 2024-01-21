// storage.ts

// Function to get favorites from local storage
/*export const getFavorites = (): string[] => {
    const favoritesStr = localStorage.getItem('favorites');
    return favoritesStr ? JSON.parse(favoritesStr) : [];
  };
  
  // Function to add a favorite to local storage
  export const addToFavorites = (packageName: string): void => {
    const favorites = getFavorites();
    if (!favorites.includes(packageName)) {
      const newFavorites = [...favorites, packageName];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
  };
  
  // Function to remove a favorite from local storage
  export const removeFromFavorites = (packageName: string): void => {
    const favorites = getFavorites();
    const newFavorites = favorites.filter((fav) => fav !== packageName);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  }; */

  // storage.ts
// storage.ts
export const getFavorites = (): string[] => {
    const favoritesStr = localStorage.getItem('favorites');
    return favoritesStr ? JSON.parse(favoritesStr) : [];
  };
  
  export const addToFavorites = (packageName: string, reason: string): void => {
    const favorites = getFavorites();
    if (!favorites.includes(packageName)) {
      const newFavorites = [...favorites, packageName];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      // Store the reason associated with the package
      addFavoriteReason(packageName, reason); // <-- Make sure this line is included
    }
  };
  
  export const removeFromFavorites = (packageName: string): void => {
    const favorites = getFavorites();
    const newFavorites = favorites.filter((fav) => fav !== packageName);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };
  
  export const getFavoriteReason = (packageName: string): string | null => {
    const reason = localStorage.getItem(`favoriteReason_${packageName}`);
    return reason ? JSON.parse(reason) : null;
  };
  
  // Add this function to store the reason
  export const addFavoriteReason = (packageName: string, reason: string): void => {
    localStorage.setItem(`favoriteReason_${packageName}`, JSON.stringify(reason));
  };
  
  // Add this function to remove the reason
  export const removeFavoriteReason = (packageName: string): void => {
    localStorage.removeItem(`favoriteReason_${packageName}`);
  };
  