# Object Types 

## Artist 

```
artist = {
    name: String,
    image: String,
    tracks: Array,
    genres: Array
}
```

## Track 

```
track = {
    name: String,
    album: String,
    image: String,
    artists: Array,
    date: Number,
}
```

## Genre 

```
genre = {
    name: String,
    artists: Array,
}
```

# Data Structures

## tracks

Type - Object

Contents - Tracks

## artists

Type - Object

Contents - Artists

## genres

Type - Object

Contents - Genres

## topPlayed

Type - Object

Contents - tracks, artists

topPlayed.tracks - Array - Track Ids

topPlayed.artists - Array - Artist Ids





## Schemas



TopPlayed 
    contains: Track Ids

TopArtists
    contains: Artist Ids

