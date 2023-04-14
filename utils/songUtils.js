exports.getSongFromId = async (songid) => {
  try {
    const response = await api.get(`/songs?id=${songid}`);
    const songData = response.data.data;
    const { id, name, album, duration, year, url, primaryArtists } =
      songData[0];

    return {
      songId: id,
      name: name,
      album: album.name,
      duration: duration,
      year: year,
      url: url,
      primaryArtists: primaryArtists,
    };
  } catch (err) {
    console.log(err);
    return {};
  }
};
