import { Wrapper } from 'enhanced-spotify-api';
import { refreshToken } from '~services/auth/refresh-token';

function RefreshableWrapper() {
  this.wrapper = new Wrapper();
}

RefreshableWrapper.prototype = {
  getCredentials: function() {
    return this.wrapper.getCredentials();
  },

  resetCredentials: function() {
    this.wrapper.resetCredentials();
  },

  setClientId: function(clientId) {
    this.wrapper.setClientId(clientId);
  },

  setClientSecret: function(clientSecret) {
    this.wrapper.setClientSecret(clientSecret);
  },

  setAccessToken: function(accessToken) {
    this.wrapper.setAccessToken(accessToken);
  },

  setRefreshToken: function(refreshToken) {
    this.wrapper.setRefreshToken(refreshToken);
  },

  setRedirectURI: function(redirectUri) {
    this.wrapper.setRedirectURI(redirectUri);
  },

  getRedirectURI: function() {
    return this.wrapper.getRedirectURI();
  },

  getClientId: function() {
    return this.wrapper.getClientId();
  },

  getClientSecret: function() {
    return this.wrapper.getClientSecret();
  },

  getAccessToken: function() {
    return this.wrapper.getAccessToken();
  },

  getRefreshToken: function() {
    return this.wrapper.getRefreshToken();
  },

  resetClientId: function() {
    return this.wrapper.resetClientId();
  },

  resetClientSecret: function() {
    return this.wrapper.resetClientSecret();
  },

  resetAccessToken: function() {
    return this.wrapper.resetAccessToken();
  },

  resetRefreshToken: function() {
    return this.wrapper.resetRefreshToken();
  },

  resetRedirectURI: function() {
    return this.wrapper.resetRedirectURI();
  },

  refreshToken: async function() {
    const {
      status,
      data,
    } = await refreshToken(this.wrapper.getRefreshToken());

    if (status === 200) {
      const {
        access_token,
      } = data;

      this.setAccessToken(access_token);

      return true;
    } else {
      return false;
    }
  },

  getMe: async function(callback) {
    try {
      return this.wrapper.getMe(callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.getMe(callback);
      }
    }
  },

  getUserPlaylists: async function(userId, options, callback) {
    try {
      return this.wrapper.getUserPlaylists(userId, options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.getUserPlaylists(userId, options, callback);
      }
    }
  },

  getPlaylist: async function(playlistId, options, callback) {
    try {
      return this.wrapper.getPlaylist(playlistId, options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.getPlaylist(playlistId, options, callback);
      }
    }
  },

  getPlaylistTracks: async function(playlistId, options, callback) {
    try {
      return this.wrapper.getPlaylist(playlistId, options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.getPlaylist(playlistId, options, callback);
      }
    }
  },

  createPlaylist: async function(userId, playlistName, options, callback) {
    try {
      return this.wrapper.createPlaylist(userId, playlistName, options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.createPlaylist(userId, playlistName, options, callback);
      }
    }
  },

  followPlaylist: async function(playlistId, options, callback) {
    try {
      return this.wrapper.followPlaylist(playlistId, options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.followPlaylist(playlistId, options, callback);
      }
    }
  },

  unfollowPlaylist: async function(playlistId, callback) {
    try {
      return this.wrapper.unfollowPlaylist(playlistId, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.unfollowPlaylist(playlistId, callback);
      }
    }
  },

  changePlaylistDetails: async function(playlistId, options, callback) {
    try {
      return this.wrapper.changePlaylistDetails(playlistId, options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.changePlaylistDetails(playlistId, options, callback);
      }
    }
  },

  uploadCustomPlaylistCoverImage: async function(playlistId, base64URI, callback) {
    try {
      return this.wrapper.uploadCustomPlaylistCoverImage(playlistId, base64URI, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.uploadCustomPlaylistCoverImage(playlistId, base64URI, callback);
      }
    }
  },

  addTracksToPlaylist: async function(playlistId, tracks, options, callback) {
    try {
      return this.wrapper.addTracksToPlaylist(playlistId, tracks, options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.addTracksToPlaylist(playlistId, tracks, options, callback);
      }
    }
  },

  removeTracksFromPlaylist: async function(playlistId, tracks, options, callback) {
    try {
      return this.wrapper.removeTracksFromPlaylist(playlistId, tracks, options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.removeTracksFromPlaylist(playlistId, tracks, options, callback);
      }
    }
  },

  removeTracksFromPlaylistByPosition: async function(
    playlistId,
    positions,
    snapshotId,
    callback
  ) {
    try {
      return this.wrapper.removeTracksFromPlaylistByPosition(
    playlistId,
    positions,
    snapshotId,
    callback
  );
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.removeTracksFromPlaylistByPosition(
    playlistId,
    positions,
    snapshotId,
    callback
  );
      }
    }
  },

  replaceTracksInPlaylist: async function(playlistId, uris, callback) {
    try {
      return this.wrapper.replaceTracksInPlaylist(playlistId, uris, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.replaceTracksInPlaylist(playlistId, uris, callback);
      }
    }
  },

  reorderTracksInPlaylist: async function(
    playlistId,
    rangeStart,
    insertBefore,
    options,
    callback
  ) {
    try {
      return this.wrapper.reorderTracksInPlaylist(
    playlistId,
    rangeStart,
    insertBefore,
    options,
    callback
  );
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.reorderTracksInPlaylist(
    playlistId,
    rangeStart,
    insertBefore,
    options,
    callback
  );
      }
    }
  },

  getMySavedTracks: async function(options, callback) {
    try {
      return this.wrapper.getMySavedTracks(options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.getMySavedTracks(options, callback);
      }
    }
  },

  containsMySavedTracks: async function(trackIds, callback) {
    try {
      return this.wrapper.containsMySavedTracks(trackIds, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.containsMySavedTracks(trackIds, callback);
      }
    }
  },

  removeFromMySavedTracks: async function(trackIds, callback) {
    try {
      return this.wrapper.removeFromMySavedTracks(trackIds, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.removeFromMySavedTracks(trackIds, callback);
      }
    }
  },

  addToMySavedTracks: async function(trackIds, callback) {
    try {
      return this.wrapper.addToMySavedTracks(trackIds, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.addToMySavedTracks(trackIds, callback);
      }
    }
  },

  removeFromMySavedAlbums: async function(albumIds, callback) {
    try {
      return this.wrapper.removeFromMySavedAlbums(albumIds, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.removeFromMySavedAlbums(albumIds, callback);
      }
    }
  },

  addToMySavedAlbums: async function(albumIds, callback) {
    try {
      return this.wrapper.addToMySavedAlbums(albumIds, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.addToMySavedAlbums(albumIds, callback);
      }
    }
  },

  getMySavedAlbums: async function(options, callback) {
    try {
      return this.wrapper.getMySavedAlbums(options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.getMySavedAlbums(options, callback);
      }
    }
  },

  containsMySavedAlbums: async function(albumIds, callback) {
    try {
      return this.wrapper.containsMySavedAlbums(albumIds, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.containsMySavedAlbums(albumIds, callback);
      }
    }
  },

  getMyTopArtists: async function(options, callback) {
    try {
      return this.wrapper.getMyTopArtists(options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.getMyTopArtists(options, callback);
      }
    }
  },

  getMyTopTracks: async function(options, callback) {
    try {
      return this.wrapper.getMyTopTracks(options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.getMyTopTracks(options, callback);
      }
    }
  },

  getMyRecentlyPlayedTracks: async function(options, callback) {
    try {
      return this.wrapper.getMyRecentlyPlayedTracks(options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.getMyRecentlyPlayedTracks(options, callback);
      }
    }
  },

  getMyDevices: async function(callback) {
    try {
      return this.wrapper.getMyDevices(callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.getMyDevices(callback);
      }
    }
  },

  getMyCurrentPlayingTrack: async function(options, callback) {
    try {
      return this.wrapper.getMyCurrentPlayingTrack(options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.getMyCurrentPlayingTrack(options, callback);
      }
    }
  },

  getMyCurrentPlaybackState: async function(options, callback) {
    try {
      return this.wrapper.getMyCurrentPlaybackState(options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.getMyCurrentPlaybackState(options, callback);
      }
    }
  },

  transferMyPlayback: async function(options, callback) {
    try {
      return this.wrapper.transferMyPlayback(options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.transferMyPlayback(options, callback);
      }
    }
  },

  play: async function(options, callback) {
    try {
      return this.wrapper.play(options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.play(options, callback);
      }
    }
  },

  pause: async function(options, callback) {
    try {
      return this.wrapper.pause(options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.pause(options, callback);
      }
    }
  },

  skipToPrevious: async function(callback) {
    try {
      return this.wrapper.skipToPrevious(callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.skipToPrevious(callback);
      }
    }
  },

  skipToNext: async function(callback) {
    try {
      return this.wrapper.skipToNext(callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.skipToNext(callback);
      }
    }
  },

  seek: async function(positionMs, options, callback) {
    try {
      return this.wrapper.seek(positionMs, options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.seek(positionMs, options, callback);
      }
    }
  },

  setRepeat: async function(options, callback) {
    try {
      return this.wrapper.setRepeat(options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.setRepeat(options, callback);
      }
    }
  },

  setShuffle: async function(options, callback) {
    try {
      return this.wrapper.setShuffle(options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.setShuffle(options, callback);
      }
    }
  },

  setVolume: async function(volumePercent, options, callback) {
    try {
      return this.wrapper.setVolume(volumePercent, options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.setVolume(volumePercent, options, callback);
      }
    }
  },

  followUsers: async function(userIds, callback) {
    try {
      return this.wrapper.followUsers(userIds, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.followUsers(userIds, callback);
      }
    }
  },

  followArtists: async function(artistIds, callback) {
    try {
      return this.wrapper.followArtists(artistIds, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.followArtists(artistIds, callback);
      }
    }
  },

  unfollowUsers: async function(userIds, callback) {
    try {
      return this.wrapper.unfollowUsers(userIds, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.unfollowUsers(userIds, callback);
      }
    }
  },

  unfollowArtists: async function(artistIds, callback) {
    try {
      return this.wrapper.unfollowArtists(artistIds, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.unfollowArtists(artistIds, callback);
      }
    }
  },

  isFollowingUsers: async function(userIds, callback) {
    try {
      return this.wrapper.isFollowingUsers(userIds, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.isFollowingUsers(userIds, callback);
      }
    }
  },

  getFollowedArtists: async function(options, callback) {
    try {
      return this.wrapper.getFollowedArtists(options, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.getFollowedArtists(options, callback);
      }
    }
  },

  areFollowingPlaylist: async function(userId, playlistId, followerIds, callback) {
    try {
      return this.wrapper.areFollowingPlaylist(userId, playlistId, followerIds, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.areFollowingPlaylist(userId, playlistId, followerIds, callback);
      }
    }
  },

  isFollowingArtists: async function(artistIds, callback) {
    try {
      return this.wrapper.isFollowingArtists(artistIds, callback);
    } catch (error) {
      console.log(error);
      if (error.message === 'The access token expired') {
        await this.refreshToken();
        return this.wrapper.isFollowingArtists(artistIds, callback);
      }
    }
  },
};

module.exports = RefreshableWrapper;
