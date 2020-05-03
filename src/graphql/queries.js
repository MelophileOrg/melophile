/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const syncUsers = /* GraphQL */ `
  query SyncUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        username
        spotifyID
        email
        tokens
        images
        following {
          id
          username
          spotifyID
          email
          tokens
          images
          public
          updated
          genres
          _version
          _deleted
          _lastChangedAt
          owner
        }
        followers {
          id
          username
          spotifyID
          email
          tokens
          images
          public
          updated
          genres
          _version
          _deleted
          _lastChangedAt
          owner
        }
        posts {
          id
          content
          entityType
          created
          _version
          _deleted
          _lastChangedAt
          owner
        }
        public
        updated
        tracks {
          id
          name
          popularity
          key
          mode
          tempo
          valence
          danceability
          energy
          acousticness
          instrumentalness
          liveness
          loudness
          speechiness
          _version
          _deleted
          _lastChangedAt
          owner
        }
        artists {
          id
          name
          images
          genres
          popularity
          followers
          _version
          _deleted
          _lastChangedAt
          owner
        }
        genres
        playlists {
          id
          name
          description
          userID
          images
          public
          _version
          _deleted
          _lastChangedAt
        }
        _version
        _deleted
        _lastChangedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      spotifyID
      email
      tokens
      images
      following {
        id
        username
        spotifyID
        email
        tokens
        images
        following {
          id
          username
          spotifyID
          email
          tokens
          images
          public
          updated
          genres
          _version
          _deleted
          _lastChangedAt
          owner
        }
        followers {
          id
          username
          spotifyID
          email
          tokens
          images
          public
          updated
          genres
          _version
          _deleted
          _lastChangedAt
          owner
        }
        posts {
          id
          content
          entityType
          created
          _version
          _deleted
          _lastChangedAt
          owner
        }
        public
        updated
        tracks {
          id
          name
          popularity
          key
          mode
          tempo
          valence
          danceability
          energy
          acousticness
          instrumentalness
          liveness
          loudness
          speechiness
          _version
          _deleted
          _lastChangedAt
          owner
        }
        artists {
          id
          name
          images
          genres
          popularity
          followers
          _version
          _deleted
          _lastChangedAt
          owner
        }
        genres
        playlists {
          id
          name
          description
          userID
          images
          public
          _version
          _deleted
          _lastChangedAt
        }
        _version
        _deleted
        _lastChangedAt
        owner
      }
      followers {
        id
        username
        spotifyID
        email
        tokens
        images
        following {
          id
          username
          spotifyID
          email
          tokens
          images
          public
          updated
          genres
          _version
          _deleted
          _lastChangedAt
          owner
        }
        followers {
          id
          username
          spotifyID
          email
          tokens
          images
          public
          updated
          genres
          _version
          _deleted
          _lastChangedAt
          owner
        }
        posts {
          id
          content
          entityType
          created
          _version
          _deleted
          _lastChangedAt
          owner
        }
        public
        updated
        tracks {
          id
          name
          popularity
          key
          mode
          tempo
          valence
          danceability
          energy
          acousticness
          instrumentalness
          liveness
          loudness
          speechiness
          _version
          _deleted
          _lastChangedAt
          owner
        }
        artists {
          id
          name
          images
          genres
          popularity
          followers
          _version
          _deleted
          _lastChangedAt
          owner
        }
        genres
        playlists {
          id
          name
          description
          userID
          images
          public
          _version
          _deleted
          _lastChangedAt
        }
        _version
        _deleted
        _lastChangedAt
        owner
      }
      posts {
        id
        user {
          id
          username
          spotifyID
          email
          tokens
          images
          public
          updated
          genres
          _version
          _deleted
          _lastChangedAt
          owner
        }
        content
        entityType
        track {
          id
          name
          popularity
          key
          mode
          tempo
          valence
          danceability
          energy
          acousticness
          instrumentalness
          liveness
          loudness
          speechiness
          _version
          _deleted
          _lastChangedAt
          owner
        }
        artist {
          id
          name
          images
          genres
          popularity
          followers
          _version
          _deleted
          _lastChangedAt
          owner
        }
        album {
          id
          name
          genres
          images
          _version
          _deleted
          _lastChangedAt
          owner
        }
        playlist {
          id
          name
          description
          userID
          images
          public
          _version
          _deleted
          _lastChangedAt
        }
        comments {
          id
          content
          created
          _version
          _deleted
          _lastChangedAt
          owner
        }
        likes {
          id
          entityType
          emoji
          created
          _version
          _deleted
          _lastChangedAt
          owner
        }
        created
        _version
        _deleted
        _lastChangedAt
        owner
      }
      public
      updated
      tracks {
        id
        name
        artists {
          id
          name
          images
          genres
          popularity
          followers
          _version
          _deleted
          _lastChangedAt
          owner
        }
        album {
          id
          name
          genres
          images
          _version
          _deleted
          _lastChangedAt
          owner
        }
        popularity
        key
        mode
        tempo
        valence
        danceability
        energy
        acousticness
        instrumentalness
        liveness
        loudness
        speechiness
        _version
        _deleted
        _lastChangedAt
        owner
      }
      artists {
        id
        name
        images
        genres
        popularity
        followers
        _version
        _deleted
        _lastChangedAt
        owner
      }
      genres
      playlists {
        id
        name
        description
        userID
        owner {
          id
          username
          spotifyID
          email
          tokens
          images
          public
          updated
          genres
          _version
          _deleted
          _lastChangedAt
          owner
        }
        images
        tracks {
          id
          name
          popularity
          key
          mode
          tempo
          valence
          danceability
          energy
          acousticness
          instrumentalness
          liveness
          loudness
          speechiness
          _version
          _deleted
          _lastChangedAt
          owner
        }
        public
        _version
        _deleted
        _lastChangedAt
      }
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        spotifyID
        email
        tokens
        images
        following {
          id
          username
          spotifyID
          email
          tokens
          images
          public
          updated
          genres
          _version
          _deleted
          _lastChangedAt
          owner
        }
        followers {
          id
          username
          spotifyID
          email
          tokens
          images
          public
          updated
          genres
          _version
          _deleted
          _lastChangedAt
          owner
        }
        posts {
          id
          content
          entityType
          created
          _version
          _deleted
          _lastChangedAt
          owner
        }
        public
        updated
        tracks {
          id
          name
          popularity
          key
          mode
          tempo
          valence
          danceability
          energy
          acousticness
          instrumentalness
          liveness
          loudness
          speechiness
          _version
          _deleted
          _lastChangedAt
          owner
        }
        artists {
          id
          name
          images
          genres
          popularity
          followers
          _version
          _deleted
          _lastChangedAt
          owner
        }
        genres
        playlists {
          id
          name
          description
          userID
          images
          public
          _version
          _deleted
          _lastChangedAt
        }
        _version
        _deleted
        _lastChangedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const syncPosts = /* GraphQL */ `
  query SyncPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPosts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        user {
          id
          username
          spotifyID
          email
          tokens
          images
          public
          updated
          genres
          _version
          _deleted
          _lastChangedAt
          owner
        }
        content
        entityType
        track {
          id
          name
          popularity
          key
          mode
          tempo
          valence
          danceability
          energy
          acousticness
          instrumentalness
          liveness
          loudness
          speechiness
          _version
          _deleted
          _lastChangedAt
          owner
        }
        artist {
          id
          name
          images
          genres
          popularity
          followers
          _version
          _deleted
          _lastChangedAt
          owner
        }
        album {
          id
          name
          genres
          images
          _version
          _deleted
          _lastChangedAt
          owner
        }
        playlist {
          id
          name
          description
          userID
          images
          public
          _version
          _deleted
          _lastChangedAt
        }
        comments {
          id
          content
          created
          _version
          _deleted
          _lastChangedAt
          owner
        }
        likes {
          id
          entityType
          emoji
          created
          _version
          _deleted
          _lastChangedAt
          owner
        }
        created
        _version
        _deleted
        _lastChangedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const syncComments = /* GraphQL */ `
  query SyncComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncComments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        user {
          id
          username
          spotifyID
          email
          tokens
          images
          public
          updated
          genres
          _version
          _deleted
          _lastChangedAt
          owner
        }
        post {
          id
          content
          entityType
          created
          _version
          _deleted
          _lastChangedAt
          owner
        }
        content
        likes {
          id
          entityType
          emoji
          created
          _version
          _deleted
          _lastChangedAt
          owner
        }
        created
        _version
        _deleted
        _lastChangedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const syncLikes = /* GraphQL */ `
  query SyncLikes(
    $filter: ModelLikeFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncLikes(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        user {
          id
          username
          spotifyID
          email
          tokens
          images
          public
          updated
          genres
          _version
          _deleted
          _lastChangedAt
          owner
        }
        entityType
        post {
          id
          content
          entityType
          created
          _version
          _deleted
          _lastChangedAt
          owner
        }
        comment {
          id
          content
          created
          _version
          _deleted
          _lastChangedAt
          owner
        }
        emoji
        created
        _version
        _deleted
        _lastChangedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const syncTracks = /* GraphQL */ `
  query SyncTracks(
    $filter: ModelTrackFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncTracks(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        artists {
          id
          name
          images
          genres
          popularity
          followers
          _version
          _deleted
          _lastChangedAt
          owner
        }
        album {
          id
          name
          genres
          images
          _version
          _deleted
          _lastChangedAt
          owner
        }
        popularity
        key
        mode
        tempo
        valence
        danceability
        energy
        acousticness
        instrumentalness
        liveness
        loudness
        speechiness
        _version
        _deleted
        _lastChangedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const getTrack = /* GraphQL */ `
  query GetTrack($id: ID!) {
    getTrack(id: $id) {
      id
      name
      artists {
        id
        name
        images
        genres
        popularity
        followers
        _version
        _deleted
        _lastChangedAt
        owner
      }
      album {
        id
        name
        genres
        images
        artists {
          id
          name
          images
          genres
          popularity
          followers
          _version
          _deleted
          _lastChangedAt
          owner
        }
        tracks {
          id
          name
          popularity
          key
          mode
          tempo
          valence
          danceability
          energy
          acousticness
          instrumentalness
          liveness
          loudness
          speechiness
          _version
          _deleted
          _lastChangedAt
          owner
        }
        _version
        _deleted
        _lastChangedAt
        owner
      }
      popularity
      key
      mode
      tempo
      valence
      danceability
      energy
      acousticness
      instrumentalness
      liveness
      loudness
      speechiness
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const listTracks = /* GraphQL */ `
  query ListTracks(
    $filter: ModelTrackFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTracks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        artists {
          id
          name
          images
          genres
          popularity
          followers
          _version
          _deleted
          _lastChangedAt
          owner
        }
        album {
          id
          name
          genres
          images
          _version
          _deleted
          _lastChangedAt
          owner
        }
        popularity
        key
        mode
        tempo
        valence
        danceability
        energy
        acousticness
        instrumentalness
        liveness
        loudness
        speechiness
        _version
        _deleted
        _lastChangedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const syncArtists = /* GraphQL */ `
  query SyncArtists(
    $filter: ModelArtistFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncArtists(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        images
        genres
        popularity
        followers
        _version
        _deleted
        _lastChangedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const getArtist = /* GraphQL */ `
  query GetArtist($id: ID!) {
    getArtist(id: $id) {
      id
      name
      images
      genres
      popularity
      followers
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const listArtists = /* GraphQL */ `
  query ListArtists(
    $filter: ModelArtistFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listArtists(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        images
        genres
        popularity
        followers
        _version
        _deleted
        _lastChangedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const syncAlbums = /* GraphQL */ `
  query SyncAlbums(
    $filter: ModelAlbumFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncAlbums(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        genres
        images
        artists {
          id
          name
          images
          genres
          popularity
          followers
          _version
          _deleted
          _lastChangedAt
          owner
        }
        tracks {
          id
          name
          popularity
          key
          mode
          tempo
          valence
          danceability
          energy
          acousticness
          instrumentalness
          liveness
          loudness
          speechiness
          _version
          _deleted
          _lastChangedAt
          owner
        }
        _version
        _deleted
        _lastChangedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const getAlbum = /* GraphQL */ `
  query GetAlbum($id: ID!) {
    getAlbum(id: $id) {
      id
      name
      genres
      images
      artists {
        id
        name
        images
        genres
        popularity
        followers
        _version
        _deleted
        _lastChangedAt
        owner
      }
      tracks {
        id
        name
        artists {
          id
          name
          images
          genres
          popularity
          followers
          _version
          _deleted
          _lastChangedAt
          owner
        }
        album {
          id
          name
          genres
          images
          _version
          _deleted
          _lastChangedAt
          owner
        }
        popularity
        key
        mode
        tempo
        valence
        danceability
        energy
        acousticness
        instrumentalness
        liveness
        loudness
        speechiness
        _version
        _deleted
        _lastChangedAt
        owner
      }
      _version
      _deleted
      _lastChangedAt
      owner
    }
  }
`;
export const listAlbums = /* GraphQL */ `
  query ListAlbums(
    $filter: ModelAlbumFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAlbums(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        genres
        images
        artists {
          id
          name
          images
          genres
          popularity
          followers
          _version
          _deleted
          _lastChangedAt
          owner
        }
        tracks {
          id
          name
          popularity
          key
          mode
          tempo
          valence
          danceability
          energy
          acousticness
          instrumentalness
          liveness
          loudness
          speechiness
          _version
          _deleted
          _lastChangedAt
          owner
        }
        _version
        _deleted
        _lastChangedAt
        owner
      }
      nextToken
      startedAt
    }
  }
`;
export const syncPlaylists = /* GraphQL */ `
  query SyncPlaylists(
    $filter: ModelPlaylistFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPlaylists(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        description
        userID
        owner {
          id
          username
          spotifyID
          email
          tokens
          images
          public
          updated
          genres
          _version
          _deleted
          _lastChangedAt
          owner
        }
        images
        tracks {
          id
          name
          popularity
          key
          mode
          tempo
          valence
          danceability
          energy
          acousticness
          instrumentalness
          liveness
          loudness
          speechiness
          _version
          _deleted
          _lastChangedAt
          owner
        }
        public
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getPlaylist = /* GraphQL */ `
  query GetPlaylist($id: ID!) {
    getPlaylist(id: $id) {
      id
      name
      description
      userID
      owner {
        id
        username
        spotifyID
        email
        tokens
        images
        following {
          id
          username
          spotifyID
          email
          tokens
          images
          public
          updated
          genres
          _version
          _deleted
          _lastChangedAt
          owner
        }
        followers {
          id
          username
          spotifyID
          email
          tokens
          images
          public
          updated
          genres
          _version
          _deleted
          _lastChangedAt
          owner
        }
        posts {
          id
          content
          entityType
          created
          _version
          _deleted
          _lastChangedAt
          owner
        }
        public
        updated
        tracks {
          id
          name
          popularity
          key
          mode
          tempo
          valence
          danceability
          energy
          acousticness
          instrumentalness
          liveness
          loudness
          speechiness
          _version
          _deleted
          _lastChangedAt
          owner
        }
        artists {
          id
          name
          images
          genres
          popularity
          followers
          _version
          _deleted
          _lastChangedAt
          owner
        }
        genres
        playlists {
          id
          name
          description
          userID
          images
          public
          _version
          _deleted
          _lastChangedAt
        }
        _version
        _deleted
        _lastChangedAt
        owner
      }
      images
      tracks {
        id
        name
        artists {
          id
          name
          images
          genres
          popularity
          followers
          _version
          _deleted
          _lastChangedAt
          owner
        }
        album {
          id
          name
          genres
          images
          _version
          _deleted
          _lastChangedAt
          owner
        }
        popularity
        key
        mode
        tempo
        valence
        danceability
        energy
        acousticness
        instrumentalness
        liveness
        loudness
        speechiness
        _version
        _deleted
        _lastChangedAt
        owner
      }
      public
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listPlaylists = /* GraphQL */ `
  query ListPlaylists(
    $filter: ModelPlaylistFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlaylists(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        userID
        owner {
          id
          username
          spotifyID
          email
          tokens
          images
          public
          updated
          genres
          _version
          _deleted
          _lastChangedAt
          owner
        }
        images
        tracks {
          id
          name
          popularity
          key
          mode
          tempo
          valence
          danceability
          energy
          acousticness
          instrumentalness
          liveness
          loudness
          speechiness
          _version
          _deleted
          _lastChangedAt
          owner
        }
        public
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
