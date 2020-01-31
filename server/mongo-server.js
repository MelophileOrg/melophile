var express = require('express');
// const fs = require('fs');
// const https = require('https');
const bodyParser = require("body-parser");
let SpotifyWebApi = require('spotify-web-api-node');

const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

mongoose.connect('mongodb://localhost:27017/melophile', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Mongoose Schemas
let Items = require("./items.js");
let Track = Items.track;
let Artist = Items.artist;
let Playlist = Items.playlist;
let User = Items.user;

// app.put("/api/images", async (req, res) => {
//   try {
//     console.log("Hello");
//     let tracks = await Tracks.aggregate([ { $sample: { size: 30 } } ]);
//     console.log(tracks);
//     let images = tracks.map(track => track.image);
//     return res.send({ images: images });
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(500);
//   }
// });

///////////////////////////////////////////////////////////////
// ANALYSIS ///////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

let requestUser = async (token) => {
  if (token == null) return null;
  let spotifyAPI =  new SpotifyWebApi();
  spotifyAPI.setAccessToken(token);
  return (await spotifyAPI.getMe()).body;
}

///////////////////////////////////////////////////////////////////////////////////////
// Base Data //////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

app.put("/api/user/stats", async (req, res) => {
  try {
    let user = await requestUser(req.body.token);
    let userData = await User.findOne({ _id: user.id });
    if (userData == null) return res.send(null);
    let stats = {
      track_num: Object.keys(userData.tracks).length,
      artist_num: Object.keys(userData.artists).length,
      genre_num: Object.keys(userData.genres).length,
    }
    return res.send(stats)
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/user/spotlight", async (req, res) => {
  try {
    let user = await requestUser(req.body.token);
    let userData = await User.findOne({ _id: user.id });
    if (userData == null) return res.send(null);
    let spotlight = {
      tracks: [],
      artists: [],
      genres: [],
    }
    let convertedItems = [];
    items = await Artist.find({ _id: {$in: await userData.topSaved.artists.map(artist => artist._id).splice(0, 5)}});
    for (let i = 0; i < items.length; i++)  {
      let newItem = {};
      newItem.image = items[i].image;
      newItem._id = items[i]._id;
      newItem.name = items[i].name;
      newItem.genres = items[i].genres;
      newItem.track_num = await userData.topSaved.artists.find(artist => artist._id == items[i]._id).track_num;
      convertedItems.push(newItem);
    }
    spotlight.artists = await convertedItems.sort((a, b) => b.track_num - a.track_num);

    let genres = [];
    for (let i = 0; i < userData.topSaved.genres.length; i++) {
      genres.push(await convertGenre(userData.topSaved.genres[i]));
    }
    spotlight.genres = genres;

    return res.send(spotlight);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

///////////////////////////////////////////////////////////////////////////////////////
// Audio Feature //////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

app.put("/api/features/all", async (req, res) => {
  try {
    let user = await requestUser(req.body.token);
    let userData = await User.findOne({ _id: user.id });
    if (userData == null) return res.send(null);
    let audioFeatures = {
      valence: {
        average: 0,
        distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        history: [],
      },
      danceability: {
        average: 0,
        distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        history: [],
      },
      energy: {
        average: 0,
        distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        history: [],
      },
      acousticness: {
        average: 0,
        distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        history: [],
      },
      instrumentalness: {
        average: 0,
        distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        history: [],
      },
      liveness: {
        average: 0,
        distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        history: [],
      },
      loudness: {
        average: 0,
        distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        history: [],
      },
      speechiness: {
        average: 0,
        distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        history: [],
      },
      key: {
        average: 0,
        distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        history: [],
      },
      mode: {
        average: 0,
        distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        history: [],
      },
      tempo: {
        average: 0,
        distribution: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
        history: [],
      },
    };
    let nowTime = (await new Date()).getTime();
    const MONTH_MILLI = 2628000000;
    let keys = Object.keys(audioFeatures);
    let total = 0;
    let tracks = await Track.find({ _id: { $in: await Object.keys(userData.tracks) }}).limit(50).skip(0);
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i] == null) continue;
      total += 1;
      for (let j = 0; j < keys.length; j++) {
        audioFeatures[keys[j]].average += tracks[i][keys[j]];
        audioFeatures[keys[j]].distribution[ Math.round(tracks[i][keys[j]] * 20) ] += 1;
        let dateTime = (await new Date(userData.tracks[tracks[i]._id].dateAdded)).getTime();
        let index = Math.floor((nowTime - dateTime) / MONTH_MILLI);
        while (audioFeatures[keys[j]].history.length <= index) {
          audioFeatures[keys[j]].history.push({val: 0, total: 0});
        }
        audioFeatures[keys[j]].history[index].val += tracks[i][keys[j]];
        audioFeatures[keys[j]].history[index].total += 1;
      }
    }
    let offset = 50;
    while (tracks.length == 50) {
      tracks = await Track.find({ _id: { $in: await Object.keys(userData.tracks) }}).limit(50).skip(offset);
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i] == null) continue;
        total += 1;
        for (let j = 0; j < keys.length; j++) {
          audioFeatures[keys[j]].average += tracks[i][keys[j]];
          audioFeatures[keys[j]].distribution[ Math.round(tracks[i][keys[j]] * 20) ] += 1;
          let dateTime = (await new Date(userData.tracks[tracks[i]._id].dateAdded)).getTime();
          let index = Math.floor((nowTime - dateTime) / MONTH_MILLI);
          while (audioFeatures[keys[j]].history.length < index) {
            audioFeatures[keys[j]].history.push({val: 0, total: 0});
          }
          audioFeatures[keys[j]].history[index].val += tracks[i][keys[j]];
          audioFeatures[keys[j]].history[index].total += 1;
        }
      }
      offset += 50;
    }
    for (let i = 0; i < keys.length; i++) {
      audioFeatures[keys[i]].average /= total;
      for (let j = 0; j < audioFeatures[keys[i]].history.length; j++) {
        audioFeatures[keys[i]].history[j].val /= audioFeatures[keys[i]].history[j].total;
      }
    }
    return res.send(audioFeatures);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/average/:feature", async (req, res) => {
  try {
    console.log("Hello");
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/distribution/:feature", async (req, res) => {
  try {
    console.log("Hello");
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

///////////////////////////////////////////////////////////////////////////////////////
// History ////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

app.put("/api/timeline/:feature", async (req, res) => {
  try {
    console.log("Hello");
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/timeline/added", async (req, res) => {
  try {
    console.log("Hello");
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/history/:year", async (req, res) => {
  try {
    console.log("Hello");
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/history/:year/:month", async (req, res) => {
  try {
    console.log("Hello");
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/timeline/:feature", async (req, res) => {
  try {
    console.log("Hello");
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

///////////////////////////////////////////////////////////////////////////////////////
// Charts /////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

// { token: STRING, }
app.put("/api/top/saved/:type", async (req, res) => {
  try {
    let user = await requestUser(req.body.token);
    let userData = await User.findOne({ _id: user.id });
    if (userData == null) return res.send(null);
    let items;
    switch(req.params.type) {
      case 'artists':
        let convertedItems = [];
        items = await Artist.find({ _id: {$in: userData.topSaved.artists.map(artist => artist._id)}});
        for (let i = 0; i < items.length; i++)  {
          let newItem = {};
          newItem.image = items[i].image;
          newItem._id = items[i]._id;
          newItem.name = items[i].name;
          newItem.genres = items[i].genres;
          newItem.track_num = await userData.topSaved.artists.find(artist => artist._id == items[i]._id).track_num;
          convertedItems.push(newItem);
        }
        return res.send(await convertedItems.sort((a, b) => b.track_num - a.track_num));
      case 'genres':
        let genres = [];
        for (let i = 0; i < userData.topSaved.genres.length; i++) {
          genres.push(await convertGenre(userData.topSaved.genres[i]));
        }
        return res.send(genres);
      default:
        return res.send(null);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/extreme/:feature/:sort", async (req, res) => {
  try {
    let user = await requestUser(req.body.token);
    let userData = await User.findOne({ _id: user.id });
    if (userData == null) return res.send(null);
    let sort = {};
    let sortTypes = [-1, 1];
    sort[req.params.feature] = sortTypes[parseInt(req.params.sort, 10)];
    let items = await Track.find({
      _id: { $in : await Object.keys(userData.tracks)}
    }).sort(sort).limit(50);
    return res.send(items);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

let convertGenre = async (genre) => {
  let randomArtists = await Artist.find({ genres: genre[0] }).limit(4);
  let newGenre = {name: genre[0], track_num: genre[1].track_num, image: randomArtists.map(artist => artist.image)};
  return newGenre;
}


///////////////////////////////////////////////////////////////////////////////////////
// Libary /////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

// { ids: [] }
app.put("/api/tracks", async (req, res) => {
  try {
    console.log(req.body);
    let tracks = {};
    for (let i = 0; i < req.body.ids.length; i++) 
      tracks[req.body.ids[i]] = await Track.findOne({ _id: req.body.ids[i] });
    return res.send({ tracks: tracks });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/tracks/:id", async (req, res) => {
  try {
    let track = await Track.findOne({ _id: req.params.id });
    return res.send({ track: track });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// { ids: [] }
app.put("/api/artists", async (req, res) => {
  try {
    let artists = {};
    for (let i = 0; i < req.body.ids.length; i++) 
      artists[req.body.ids[i]] = await Artist.findOne({ _id: req.body.ids[i] });
    return res.send({ artists: artists });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/artists/:id", async (req, res) => {
  try {
    let artist = await Artist.findOne({ _id: req.params.id });
    return res.send({ artist: artist });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// { ids: [] }
app.put("/api/playlists", async (req, res) => {
  try {
    let playlists = {};
    for (let i = 0; i < req.body.ids.length; i++) 
      playlists[req.body.ids[i]] = await Playlist.findOne({ _id: req.body.ids[i] });
    return res.send({ playlists: playlists });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put("/api/playlists/:id", async (req, res) => {
  try {
    let playlist = await Playlist.findOne({ _id: req.params.id });
    return res.send({ playlist: playlist });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});



var server = app.listen(3003, function(){
    console.log("Listening on 3003");
});
// https.createServer({
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert')
// }, app).listen(3002, () => console.log('Listening on port 3002. Go to https://localhost:3002/'));






