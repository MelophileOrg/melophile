<div align="center">
    <image  align="center"src="./documentation/images/title.png"/><br/>
</div>

<p align="center">Web application for analyzing your music library using Spotify's API.</p>

<p align="center" style="margin: 0px auto; margin-top: 15px; max-width: 600px">
    <a href="https://melophile.org"><img src="https://img.shields.io/website?down_color=ff4b12&down_message=in%20production&up_message=live&url=https%3A%2F%2Fmelophile.org"></a>
    <a href="#"><img src="https://img.shields.io/github/commit-activity/m/andyruwruw/melophile?color=0781ff"/></a>
    <a href="https://melophile.org"><img src="https://img.shields.io/github/last-commit/andyruwruw/melophile?color=%230781ff"></a>
</p>
<p align="center">
    <a href="https://www.linkedin.com/in/andrew-young-3322b3133/">Project by Andrew Young.</a>
</p>

# Project Goals

Melophile is a web app that uses [Spotify's API](https://developer.spotify.com/documentation/web-api/) to anyalyze your music library and generate data and graphs. 

This project aims to use all data available to allow you to view your library in a whole new way, and make discoveries about your music taste that were otherwise impossible.

Sharing and making your profile public allows users to discover new music through the best of other's libraries.

Think [Spotify Wrapped](https://open.spotify.com/genre/2019-page) with a greater emphasis on your library as a whole. 

# Documentation
- [Available Services](#Available-Services)
- [Development Updates](#Development-Updates)
- [Code Structure](#Code-Structure)

# Available Services

- [Your Library Overview](#overview)
- [Your Top Charts](#charts)
- [Sharing Your Data](#social)
- [Discovery Tool](#discover)
- [Your History](#history)
- [Track Analysis](#track)
- [Artist Analysis](#artist)
- [Playlist Analysis](#playlist)
- [Genre Analysis](#genre)
- [Album Analysis](#album)

<h1 style="display: flex; align-items: center" id="overview">
    <img style="margin-right: 20px; margin-top: 10px" src="./documentation/images/overview-icon.png">
    Your Library Overview
</h1>

Your Library Overview contains data on **your library as a whole**:
- Number of Tracks, Artists, Genres, Playlists
- Timeline of when you liked tracks.
- Top Played Tracks (Top 5)
- Top Played Artists (Top 5)
- Top Liked Genres (Top 5)
- Averages of:
    - Happiness
    - Danceability
    - Energy
    - Tempo
- Distribution graphs of:
    - Happiness
    - Danciability
    - Energy
- Chance a song in your library is:
    - Live
    - Accoustic
    - Instrumental
    - Speech Based (Podcasts)
- Percent of tracks in Major Key vs Minor

This data is shareable and **updates upon request**. 

Your overview is first generated on your first login and takes some time depending on how large your library is. The application is requesting every song, every track, every playlist in order to generate this data.

<h1 style="display: flex; align-items: center" id="overview">
    <img style="margin-right: 20px; margin-top: 10px" src="./documentation/images/charts-icon.png">
    Your Top Charts
</h1>

Your Top Charts are separated into three categories: **Top Played**, **Top Saved** and **Extremes**.

The **save button** allows you to create a **Playlist** for a chart of your choice.

## Top Played

Top played looks at **listening time**. These lists are provided by [Spotify's API](https://developer.spotify.com/documentation/web-api/).

You can choose to view your top played:
- Tracks
- Artists

And clarify the scope to:
- Last few years
- Last few months
- Last few weeks

## Top Saved

Top saved looks at **how many tracks you have saved under a given artist or genre**. These lists are generated from processing your library.

You can choose to view your top saved:
- Artists
- Genres

## Extremes

Extremes sort your library by either the **most** or **least** of the following categories:
- Happy
- Danceable
- Energetic
- Tempo
- Chance it's Live
- Chance it's Accoustic
- Chance it's Instrumental
- Chance it's Speech based (podcasts)

So you can see you're happiest tracks, slowest tracks, least danceable, and so on.


<h1 style="display: flex; align-items: center" id="social">
    <img style="margin-right: 20px; margin-top: 10px" src="./documentation/images/social-icon.png">
    Sharing Your Data
</h1>

Your [Library Overview](#overview) and [Top Charts](#charts) are shareable via link. By default your data is private and only accessable to you when you login with your Spotify account.

The hope is people will have access to each other's top played and discover new music through the best of each other's libraries!

Should you wish to share your data, a button on your [Library Overview](#overview) page, or the tab **My Profile** will allow you to select items you wish to be shared.

You have two choices for sharing:
- Public
- By Link

**Public** will be featured on the **Public Profiles** page for all to see. 

**By Link** will only be accessable for those who have your specific link. They are public, but you'd have to know the exact link.

I hope you consider making your profile public!

<h1 style="display: flex; align-items: center" id="discover">
    <img style="margin-right: 20px; margin-top: 10px" src="./documentation/images/discover-icon.png">
    Discovery Tool
</h1>

The discovery tool is an extension of the already existing **Radio** tool from Spotify with more options.

To start, select **up to five** artists or tracks you'd like to find simular tracks to.

Recommends will be listed, however you can apply advanced filters.

For each of the listed traits, you can specify a **target value** or **minimum** and **maximum**:
- Happiness
- Danceability
- Energy
- Tempo
- Accousticness
- Instrumentalness
- Liveness
- Speechiness

This allows you to tailor your radios to requests such as:
- *Find me tracks like this but happier.*
- *Find me tracks like this but make sure they're still sad.*
- *Find me tracks like this but more danceable.*
- *Find me tracks like this but instrumental.*

Keep in mind the further you filter results the harder of a time Spotify has finding your exact needs, and in some cases no results will be returned.

Keep filters simple and use **target value** over **minimum** and **maximum** for best results.

The **save button** allows you to create a **Playlist** for a list of recommends.

<h1 style="display: flex; align-items: center" id="history">
    <img style="margin-right: 20px; margin-top: 10px" src="./documentation/images/history-icon.png">
    Your History
</h1>

Your History includes [Library Overview](#overview) data specific to specified **years** or **months**. 

General data once again includes:
- Timeline of when you liked tracks.

However additionally included:
- Timeline of genre trends
- Timeline of artist trends

Meaning a timeline showing you what genres / artist you were most into and when.

It should be noted, [Spotify's API](https://developer.spotify.com/documentation/web-api/) does not provide **listening time** data besides their **top played** endpoint. 

That means all this data is derived from **what you liked (added) in a given time period**.

If you spent a whole month listening to a song you added years ago, there's no way to know that. This data is only relevent to what you were adding to your libary.

On top of general timelines you can view:
- Month Analysis'
- Year Analysis'

These will include:
- Number of Tracks, Artists, Genres Added
- Timeline of when you liked tracks.
- Top Saved Artists
- Top Liked Genres
- Averages of:
    - Happiness
    - Danceability
    - Energy
    - Tempo
- Distribution graphs of:
    - Happiness
    - Danciability
    - Energy
- Chance a song your liked in this time interval is:
    - Live
    - Accoustic
    - Instrumental
    - Speech Based (Podcasts)
- Percent of tracks in Major Key vs Minor

The **save button** allows you to create a **Playlist** for a month or year of your choice, or create playlists for every month or year.

<h1 style="display: flex; align-items: center" id="track">
    <img style="margin-right: 20px; margin-top: 10px" src="./documentation/images/track-icon.png">
    Track Analysis
</h1>

Any **Track** shown on melophile.org can be selected to take you to it's analysis.

Track Analysis has multiple tabs with different information:
- Overview
- Analysis
- Compairson

## Overview

Overview focuses on **general track data**.

Information displayed includes:
- Album Data
- Artist Data
- Genre Data
- Popularity
- Simular Songs
- Release Date

## Analysis

Analysis focuses on **audio data from the track**.

Information displayed includes:
- Visualzation of Audio Wave.
- Happiness
- Danceability
- Energy
- Chance the Track is:
    - Live
    - Accoustic
    - Instrumental
    - Speech Based (podcast)
- Musical Statistics:
    - Key
    - Major / Minor
    - Tempo
    - Duration
    
## My Relationship

My Relationship focuses on **how this track compairs or fits into your library**.

Information displayed includes:
- Compaired to your library what **percentile** it falls under in the following categories:
    - Happiness
    - Danceability
    - Energy
- When you liked it.
- What else you were liking at the time.
- Playlists you included it in.
- Simular tracks in your library.

<h1 style="display: flex; align-items: center" id="artist">
    <img style="margin-right: 20px; margin-top: 10px" src="./documentation/images/artist-icon.png">
    Artist Analysis
</h1>

Any **Artist** shown on melophile.org can be selected to take you to it's analysis.

Artist Analysis has multiple tabs with different information:
- Overview
- My Relationship
- Tracks

## Overview

Overview focuses on **general artist data**.

Information displayed includes:
- Populartity
- Followers
- List of Top Tracks
- Top Track Characteristics: 
    - Happiness
    - Danceability
    - Energy
- Artist Genres
- Related Artists
- Description
- Albums
    - Sortable by:
        - Happiness
        - Energy
        - Danceability
        - Popularity

## My Relationship

My Relationship focuses on **your relationship with this artist**.

Information displayed includes:
- When you first liked a track from them.
- Age of relationship (date last liked - date first liked)
- Timeline of when you liked their tracks.
- Averages of the tracks you liked:
    - Happiness
    - Danceability
    - Energy
    - Popularity
- Distributions of the tracks you liked by characteristic:
    - Happiness
    - Danceability
    - Energy
    - Popularity
- Other tracks you liked at the same time.
- Playlist you included them in

## Tracks

Tracks is a **list of tracks you've liked from them**.

Sortable by:
- Added Date
- Happiness
- Danceability
- Energy
- Popularity

<h1 style="display: flex; align-items: center" id="playlist">
    <img style="margin-right: 20px; margin-top: 10px" src="./documentation/images/playlist-icon.png">
    Playlist Analysis
</h1>

Any **Playlist** shown on melophile.org can be selected to take you to it's analysis.

Playlist Analysis has multiple tabs with different information:
- Overview
- Tracks

## Overview

Overview focuses on **general playlist data**.

Information displayed includes:
- Owner Data
- Creation Date
- Number of Track and Artists
- Age of relationship (date last liked - date first liked)
- Characteristics Over Course of Playlist:
    - Happiness
    - Danceability
    - Energy
- Distribution of:
    - Happiness
    - Danceablity
    - Energy
- Artists Present
    - Dominant (If Any)
- Genres Present
    - Dominant (If Any)
- Followers

## Tracks

Tracks is a **list of tracks you've liked from them**.

Sortable by:
- Happiness
- Energy
- Danceability
- Popularity
- Added Date

**Changes can be applied directly to the playlist** should you wish to reorder them.

<h1 style="display: flex; align-items: center" id="genre">
    <img style="margin-right: 20px; margin-top: 10px" src="./documentation/images/genre-icon.png">
    Genre Analysis
</h1>

Any **Genre** shown on melophile.org can be selected to take you to it's analysis.

It should be noted genres are assigned to **Artists** and therefore as assumed for all of their tracks. Spotify does not give **Tracks** genres.

The **save button** allows you to create a **Playlist** for a genre.

Genre Analysis has multiple tabs with different information:
- Overview
- Tracks
- Artists

## Overview

Overview focuses on **general genre data**.

Information displayed includes:
- Number of Tracks and Artists
- Most liked Artist in this Genre
- Distributions of liked track characteristics:
    - Happiness
    - Danceability
    - Energy
- Timline of when you liked tracks in this genre.
- Playlists where this genre is dominant.

## Tracks

Tracks is a **list of tracks you've liked from this genre**.

Sortable by:
- Happiness
- Danceability
- Energy
- Added Date

## Artists

Artists is a **list of artists you've liked from this genre**.

Sortable by:
- Number of tracks saved.

<h1 style="display: flex; align-items: center" id="album">
    <img style="margin-right: 20px; margin-top: 10px" src="./documentation/images/album-icon.png">
    Album Analysis
</h1>

Any **Album** shown on melophile.org can be selected to take you to it's analysis.

Album Analysis has multiple tabs with different information:
- Overview
- Tracks

## Overview

Overview focuses on **general album data**.

Information displayed includes:
- Artist Data
- Number of Tracks
- Average Popularity
- Distributions of track characteristics:
    - Happiness
    - Danceability
    - Energy
- Characteristics Over Course of Album:
    - Happiness
    - Danceability
    - Energy
- Release Date
- Genres
- Playlist you included it in.

## Tracks

Tracks is a **list of tracks from the album**.

Sortable by:
- Offical Order
- Happiness
- Danceability
- Energy

# Development Updates

## Working On:
- Refactor of melophile.org
- Refactor of server.

## Planned:
- Mobile Application
- [Melophile | Clash](https://github.com/andyruwruw/melophile-clash): Round based game using your top tracks.
- Melophile | Playlists: Website dedicated to Playlist Generation
- Melophile | Convert: Website dedicated to conversion from Apple Music to Spotify

# Code Structure

A peek into how the site was built and how it works.
- [Front-End](#melophile.org)
- [Back-end](#Server-Design)

# melophile.org

melophile.org is designed using [Vue CLI](https://cli.vuejs.org/), a front-end framework. Additional components are used from [Vuetify](https://vuetifyjs.com/en/).

For additional information [visit the markdown](https://github.com/andyruwruw/melophile/blob/master/documentation/FRONTEND.md).

# Server Design

The server is designed using **node.js**. 

Analysis and data requests are made to an [express](https://expressjs.com/) Rest API.

Processing of the user's library is dealt with by a [web-socket server](https://socket.io/).

Data is saved to a [Mongo Database](https://www.mongodb.com/) to limit the amount of requests required to [Spotify's API](https://developer.spotify.com/documentation/web-api/).

For additional information [visit the markdown](https://github.com/andyruwruw/melophile/blob/master/documentation/FRONTEND.md).


---

## Hope you enjoy!

<img src="https://media.giphy.com/media/3ndAvMC5LFPNMCzq7m/giphy.gif"/>

