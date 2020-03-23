# Artist Data Access Object (DAO)

Various methods for working with and retrieving with Artist Data.

- Models
    - Artist
- Associated DAOs
    - ArtistsDAO
    - TracksDAO
    - AlbumsDAO
    - GenreDAO
- Methods
    - [Constructor](#constructor)
    - [Is In Database](#is-in-database)
    - [Save](#save)
    - [Get Complete Data](#get-complete-data)
    - [Retrieve Complete Data](#retrieve-complete-data)
    - [Retrieve Complete Data From Spotify](#retrieve-complete-data-from-spotify)
    - [Retrieve Complete Data From Database](#retrieve-complete-data-from-database)
    - [Get Artist's Genres](#get-artists-genres)
    - [Get Artists Albums](#get-artists-albums)
    - [Get Artist's Top Tracks](#get-artists-top-tracks)
    - [Get Simular Artists](#get-simular-artists)
    - [Get Discogs Data](#get-discogs-data)

# Constructor
```
new ArtistDAO(id, data)
```
### __Parameters__:
| Name | Type     | Description                    |
|------|----------|--------------------------------|
| id   | `string` | Spotify ID of Item             |
| data | `object` | Optional data to be loaded in. |

### __Description__: 
*Creates a new instance of Artist Data Access object for a given artist. Loads in data.*

### __Returns__: 
```
{ArtistDAO} 
```

# Is In Database
```
.inDatabase()
```
### __Parameters__:

### __Description__: 
*Return boolean if artist is stored in database.*

### __Returns__: 
```
{boolean}
```

# Save
```
.save(spotifyAPI)
```
### __Parameters__:
| Name | Type     | Description                    |
|------|----------|--------------------------------|
| spotifyAPI   | `spotify-web-api` | Instances of spotify-web-api wrapper.             |

### __Description__: 
*Saves data to database. Retrieves data if nessisary.*

### __Returns__: 
```
{void}
```

# Get Complete Data
```
.getCompleteData(spotifyAPI)
```
### __Parameters__:
| Name | Type     | Description                    |
|------|----------|--------------------------------|
| spotifyAPI   | `spotify-web-api` | Instances of spotify-web-api wrapper.             |

### __Description__: 
*Returns all artist data, identical to Artist Model.*

### __Returns__: 
```
{object} {
    _id: String,
    name: String,
    images: Array of {url: String, height: Number, width: Number}
    genres: Array of Strings
    popularity: Number,
    followers: Number,
}
```



# Retrieve Complete Data
```
.retrieveCompleteData(spotifyAPI)
```
### __Parameters__:
| Name | Type     | Description                    |
|------|----------|--------------------------------|
| spotifyAPI   | `spotify-web-api` | Instances of spotify-web-api wrapper.             |

### __Description__: 
*Retrieves artist object from the Database or Spotify API and loads in data.*

### __Returns__: 
```
{void}
```

# Retrieve Complete Data From Spotify
```
.retrieveCompleteDataFromSpotify(spotifyAPI)
```
### __Parameters__:
| Name | Type     | Description                    |
|------|----------|--------------------------------|
| spotifyAPI   | `spotify-web-api` | Instances of spotify-web-api wrapper.             |

### __Description__: 
*Retrieves artist object from Spotify API and loads in data.*

### __Returns__: 
```
{void}
```

# Retrieve Complete Data From Database
```
.retrieveCompleteDataFromDatabase()
```
### __Parameters__:

### __Description__: 
*Retrieves artist object from database and loads in data.*

### __Returns__: 
```
{void}
```


# Get Artist's Genres
```
.getGenres(spotifyAPI)
```
### __Parameters__:
| Name | Type     | Description                    |
|------|----------|--------------------------------|
| spotifyAPI   | `spotify-web-api` | Instances of spotify-web-api wrapper.             |

### __Description__: 
*Returns array of Genre DAOs for Artist.*

### __Returns__: 
```
{array} Array of GenreDAO
```

# Get Artist's Top Tracks
```
.getTopTracks(spotifyAPI)
```
### __Parameters__:
| Name | Type     | Description                    |
|------|----------|--------------------------------|
| spotifyAPI   | `spotify-web-api` | Instances of spotify-web-api wrapper.             |

### __Description__: 
*Returns Tracks DAO of Top Tracks*

### __Returns__: 
```
{TracksDAO}
```


# Get Simular Artists
```
.getSimular(spotifyAPI)
```
### __Parameters__:
| Name | Type     | Description                    |
|------|----------|--------------------------------|
| spotifyAPI   | `spotify-web-api` | Instances of spotify-web-api wrapper.             |

### __Description__: 
*Returns Artists DAO of simular Artists*

### __Returns__: 
```
{ArtistsDAO}
```

# Get Discogs Data
```
.getDiscogsData()
```
### __Parameters__:

### __Description__: 
*Returns object with Artist data retrieved from Discogs.*

### __Returns__: 
```
{object} {
    namevariations: Array of Strings,
    profile: String,
    releases_url: String,
    resource_url: String,
    uri: String,
    urls: Array of Strings,
    data_quality: String,
    id: Number,
    images: Array of {height: Number, width: Number, resource_url: String, type: String, uri: String, uri150: String},
    members: Array of {active: Boolean, id: Number, name: String, resource_url: String},
    namevariations: String,
    namevariations: String,
    namevariations: String,
    namevariations: String,
    namevariations: String,
    namevariations: String,
    namevariations: String,
}
```


# Get Artist's Albums
```
.getArtistsAlbums(spotifyAPI)
```
### __Parameters__:
| Name | Type     | Description                    |
|------|----------|--------------------------------|
| spotifyAPI   | `spotify-web-api` | Instances of spotify-web-api wrapper.             |

### __Description__: 
*Returns Albums Data Access Object of Artist Albums*

### __Returns__: 
```
{AlbumsDAO}
```