<div align="center">
<image src="./images/back-end.png"/><br/>
</div>

<p align="center" style="margin: 0px auto; margin-top: 15px; max-width: 600px">
    <img src="https://img.shields.io/badge/runtime-node.js-orange">
    <img src="https://img.shields.io/badge/database-mongodb-orange">
    <img src="https://img.shields.io/badge/dependency-socket.io-orange">
    <img src="https://img.shields.io/badge/dependency-socket.io-orange">
    <img src="https://img.shields.io/badge/dependency-spotify--web--api--node-orange">
</p>

# Documentation
- [Analysis Server](#Analysis-Server)
    - [General](#general-analysis)
    - [Endpoints](#Endpoints)
- [Process Server](#Process-Server)
    - [General](#general-process)
    - [Event Listeners](#Event-Listeners)

# Analysis Server
- [General](#general-analysis)
- [Endpoints](#Endpoints)

<h1 id="general-analysis">General</h1>

Analysis and data requests are made to an [express](https://expressjs.com/) Rest API.

Data is saved to a [Mongo Database](https://www.mongodb.com/) to limit the amount of requests required to [Spotify's API](https://developer.spotify.com/documentation/web-api/).

# Endpoints
- Authorization
    - Login
    - Login Callback
    - Automatic Login
    - Logout
- Search
    - Search
    - Discover
- Me
    - My Stats
    - My Features
    - My Added Timeline
    - My Top Played Tracks Chart
    - My Top Played Artists Chart
    - My Top Saved Artists Chart
    - My Top Saved Generes Chart
    - My Extremes Chart
    - My Spotlights
- Track
    - Track Base Data
    - Track Features
    - Track Analysis
    - Track Artists
    - Track Percentiles
    - Track Simular (Spotify)
    - Track Simular (Library)
    - Playlists Track In
- Artist
    - Artist Base Data
    - Artist Liked Tracks
    - Artist Top Tracks
    - Artists Simular
    - Artist Albums
    - Artist Genres
    - Artist History
    - Tracks Liked Around Same Time
    - Playlists Artist In
- Playlist
    - Playlist Base Data
    - Playlist Tracks
    - Playlist Artists
    - Playlist Genres
    - Playlist Characteristics Over Time
    - Update Playlist Data
- Genre
    - Genre Base Data
    - Genre Tracks
    - Genre Artists
    - Genre History
- Album
    - Album Base Data
    - Album Tracks
    - Album Artists
    - Album Genres
- Profile


# Automatic Login
## `GET /api/auth/`

# Login
## `GET /api/auth/login`

# Login Callback
## `GET /api/auth/callback`

# My Stats
## `GET /api/me/stats`

# My Features
## `GET /api/me/features`

# My Added Timeline
## `GET /api/me/history/added`

# My Top Played Tracks Chart
## `GET /api/me/chart/played/tracks/:time_range`

# My Top Played Artists Chart
## `GET /api/me/chart/played/artists/:time_range`

# My Top Saved Artists Chart
## `GET /api/me/chart/saved/artists`

# My Top Saved Genres Chart
## `GET /api/me/chart/saved/genres`

# My Extremes Chart
## `GET /api/me/chart/extreme/:feature/:sort`

# My Spotlights
## `GET /api/me/spotlight`

# Track Base Data
## `GET /api/track/:id`

# Process Server
- [General](#general-process)
- [Event Listeners](#Event-Listeners)

<h1 id="general-process">General</h1>

Processing of the user's library is dealt with by a [web-socket server](https://socket.io/).

Data is saved to a [Mongo Database](https://www.mongodb.com/) to limit the amount of requests required to [Spotify's API](https://developer.spotify.com/documentation/web-api/).

# Event Listeners

