const api = require("../config/externalApi");
const songUtils = require("../utils/songUtils");
let songs = [];

//Get trending albums from the homepage of Saavn
const getTrendingAlbums = async () => {
  try {
    const response = await api.get("/modules?language=hindi");
    const albums = response.data.data.trending.albums;
    for (const album of albums) {
      try {
        const data = await getAlbumSongs(album.id);
        songs.push(data);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

//Get songs from a single album
const getAlbumSongs = async (albumId) => {
  try {
    const response = await api.get(`albums?id=${albumId}`);
    const songs = response.data.data.songs;
    return songs.map((item) => {
      return {
        songId: item.id,
        name: item.name,
        url: item.url,
      };
    });
  } catch (err) {
    console.log(err);
  }
};

//Get songs list from the search term
const searchSongsForQuery = async (query) => {
  try {
    const page = 1;
    const searchResultsLimit = 30;
    const response = await api.get(
      `/search/songs?query=${query}&page=${page}&limit=${searchResultsLimit}`
    );
    const results = response.data.data.results;
    return results.map((item) => {
      return {
        songId: item.id,
        name: item.name,
        url: item.url,
      };
    });
  } catch (err) {
    console.log(err);
  }
};

//GET method to get a list of all songs
exports.getAllSongs = async (req, res) => {
  try {
    await getTrendingAlbums();
    res.status(200).json({ songs: songs.flat() });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later!" });
  }
};

//GET method to get details about a song with given id
exports.getSingleSong = async (req, res) => {
  try {
    const songDetails = await songUtils.getSongFromId(req.params.songid)
    
    //Check if song was found or not
    if (Object.keys(songDetails).length === 0) {
      return res.status(404).json({
        err: "Song with given id does not exist. Please recheck the songId!",
      });
    }

    return res.status(200).json({songDetails: songDetails});
    
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later!" });
  }
};

//POST method to search for songs that match the search term
exports.searchSong = async (req, res) => {
  try {
    const { term } = req.query;

    //Check if term is undefined or an empty string
    if (!term || !term.trim()) {
      res
        .status(400)
        .json({ err: "Please enter a valid search term and try again!" });
    }

    const songsList = await searchSongsForQuery(`${term}`);
    return res.status(200).json({ results: songsList });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later!" });
  }
};
