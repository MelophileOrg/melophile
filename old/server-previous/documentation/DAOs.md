# Data Access Objects (DAO)

## Table of Contents
- [TrackDAO](#TrackDAO)
- [ArtistDAO](#ArtistDAO)
- [PlaylistDAO](#PlaylistDAO)
- [AlbumDAO](#AlbumDAO)
- [GenreDAO](#GenreDAO)
- [UserDAO](#UserDAO)

---

# TrackDAO
## `Constructor(id, data) `
*Create new instance of TrackDAO.*
### Parameters
| Name | Type     | Description                                 |
|------|----------|---------------------------------------------|
| id   | `string` | ID of Track                                 |
| data | 'object' | Object with any pre-loaded data (optional). |

### Return
```
<TrackDAO Object>
```
## `Instance.inDatabase()`
*Checks if track is in Database.*
### Parameters

### Return
```
<Boolean>
```
## `Instance.getData(spotifyAPI) `
*Returns basic Javascript object with instance variables. Retrieves data from API or Database if needed.*
### Parameters
| Name | Type     | Description                                 |
|------|----------|---------------------------------------------|
| spotifyAPI   | `spotify-web-api-node` | Wrapper for Spotify Web API                                 |

### Return
```
{
    _id: String,
    name: String,
    artists: Array, 
    album: Object,  
    image: String,
    key: Number,
    mode: Number,
    tempo: Number,
    valence: Number,
    danceability: Number,
    energy: Number,
    acousticness: Number,
    instrumentalness: Number,
    liveness: Number,
    loudness: Number,
    speechiness: Number,
    popularity: Number,
}
```
## `Instance.save(spotifyAPI) `
*Saves track to database. Retrieves data from Spotify API if needed. Returns array of artists.*
### Parameters
| Name | Type     | Description                                 |
|------|----------|---------------------------------------------|
| spotifyAPI   | `spotify-web-api-node` | Wrapper for Spotify Web API                                 |

### Return
```
// Array of Minified Artist Objects for Track
[
    // Minified Artist Object
    {
        _id: String,
        name: String,
    } ...
]
```
## `Instance.getAudioFeatures(spotifyAPI) `
*Returns basic Javascript object with just audio feature values. Retrieves if nessisary.*
### Parameters
| Name | Type     | Description                                 |
|------|----------|---------------------------------------------|
| spotifyAPI   | `spotify-web-api-node` | Wrapper for Spotify Web API                                 |

### Return
```
{
    key: Number,
    mode: Number,
    tempo: Number,
    valence: Number,
    danceability: Number,
    energy: Number,
    acousticness: Number,
    instrumentalness: Number,
    liveness: Number,
    loudness: Number,
    speechiness: Number,
}
```
## `Instance.getAudioAnalysis(spotifyAPI) `
*Returns array with audio analysis of track.*
### Parameters
| Name | Type     | Description                                 |
|------|----------|---------------------------------------------|
| spotifyAPI   | `spotify-web-api-node` | Wrapper for Spotify Web API                                 |

### Return
```
[

]
```
## `Instance.getRecommends(spotifyAPI) `
*Returns array of recommended Tracks.*
### Parameters
| Name | Type     | Description                                 |
|------|----------|---------------------------------------------|
| spotifyAPI   | `spotify-web-api-node` | Wrapper for Spotify Web API                                 |

### Return
```
// Recommended Track Objects
[
    // Data object for tracks.
    {
        _id: String,
        name: String,
        artists: Array, 
        album: Object,  
        image: String,
        key: Number,
        mode: Number,
        tempo: Number,
        valence: Number,
        danceability: Number,
        energy: Number,
        acousticness: Number,
        instrumentalness: Number,
        liveness: Number,
        loudness: Number,
        speechiness: Number,
        popularity: Number,
    } ...
]
```
---

## ArtistDAO

---

## PlaylistDAO

---

## AlbumDAO

---

## GenreDAO

---

## UserDAO

