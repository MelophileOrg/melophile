# Artist Data Access Object (DAO)

Various methods for working with and retrieving with Artist Data.

# Constructor
```
new ArtistDAO(id, data)
```
### Parameters:
| Name | Type     | Description                    |
|------|----------|--------------------------------|
| id   | `string` | Spotify ID of Item             |
| data | `object` | Optional data to be loaded in. |

### Description: 
*Creates a new instance of Artist Data Access object for a given artist. Loads in data.*

### Returns: 
```
{class} ArtistDAO
```

# Is In Database
```
.inDatabase()
```
### Parameters:
| Name | Type     | Description                    |
|------|----------|--------------------------------|

### Description: 
*Return boolean if artist is stored in database.*

### Returns: 
```
{boolean}
```

# Get Complete Data
```
.getCompleteData(spotifyAPI)
```
### Parameters:
| Name | Type     | Description                    |
|------|----------|--------------------------------|
| spotifyAPI   | `spotify-web-api` | Instances of spotify-web-api wrapper.             |

### Description: 
*Returns all artist data, identical to Artist Model.*

### Returns: 
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