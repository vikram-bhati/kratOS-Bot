const axios = require('axios');

const config = require('./config');

function discoverMovie(genreId) {
  return moviedbApiCall(genreId).then(response =>
    apiResultToCarousselle(response.data.results)
  );
}

function moviedbApiCall(genreId) {
  return axios.get(`https://api.themoviedb.org/3/discover/movie`, {
    params: {
      api_key: config.MOVIEDB_TOKEN,
      sort_by: 'popularity.desc',
      include_adult: false,
      with_genres: genreId,
    },
  });
}

function apiResultToCarousselle(results) {
  if (results.length === 0) {
    return [
      {
        type: 'quickReplies',
        content: {
          title: 'Sorry, but I could not find any results for your request :(',
          buttons: [{ title: 'Start over', value: 'Start over' }],
        },
      },
    ];
  }

  const cards = results.slice(0, 10).map(e => ({
    title: e.title || e.name,
    subtitle: e.overview,
    imageUrl: `https://image.tmdb.org/t/p/w640${e.poster_path}`,
    buttons: [
      {
        type: 'web_url',
        value: `https://www.themoviedb.org/movie/${e.id}`,
        title: 'View More',
      },
    ],
  }));

  return [
    {
      type: 'text',
      content: "Here's what I found for you!",
    },
    { type: 'carouselle', content: cards },
  ];
}

module.exports = {
  discoverMovie,
};
