/**
 * Get Redirect URL
 * Returns URL for Spotify auth callback
 *
 * @param {string} sender Service sending request.
 */
export const getRedirectUrl = (sender) => {
  switch (sender) {
    case 'melophile': {
      return 'https://melophile.org/auth';
    }
    default: {
      return 'http://localhost:8080/auth';
    }
  }
};