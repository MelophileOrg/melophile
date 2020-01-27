# Melophile

[http://melophile.org](http://melophile.org)

## Summary

Melophile is a web app that uses Spotify's API to anyalyze your music taste and generate graphs and data. Think "Spotify Wrapped". Although Spotify's API doesn't allow viewing of minutes spent listening, other statistics can be drawn from tracks you've saved. This project aims to use all data available to allow you to view your library in a whole new way, and make discoveries about your music taste that were otherwise impossible.

Project by Andrew Young.

## Features

## Structure

## Development

## The Whole Story

I began this project early September of 2019. I realized Spotify had an [awesome API](https://developer.spotify.com/documentation/web-api/) that offered so much data. Originally I was just going to create an application called "My Music Mood", which took [recently played](https://developer.spotify.com/documentation/web-api/reference/player/get-recently-played/), or [recently top played tracks](https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/), in combination with  [Spotify Audio Features](https://developer.spotify.com/documentation/web-api/reference/tracks/get-several-audio-features/) to determine the user's mood. The plan was the use [Plutchik's Wheel of Emotions](https://www.6seconds.org/2017/04/27/plutchiks-model-of-emotions/) and use track data to graph your mood.

I was so excited once I got the API running, and started playing around with sorting through my whole library to find my `most danceable` or `least energetic` tracks. 

I realized how many other cool projects were out there using the Spotify API, but one never had everything I wanted, or missed out on some other cool features I would have loved to see.

As an avid music lover, with over 4,500 tracks saved and 400 playlists, the data I was drawing out from my library was awesome.

I had done a lot of projects with Vue CLI, and as I kept adding feature after feature, things got a bit messy. 

I worked for months, refactoring 9 times, speeding up the algorithm to read your library, changing the UI, converting things to the back-end and implementing web-sockets. Every obscure library I knew somehow found its way into this project.
