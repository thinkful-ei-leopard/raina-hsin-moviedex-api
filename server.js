require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movie-data.json')
const app = express()
app.use(morgan('dev'))
app.use(helmet());
app.use(cors());




app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  //move to the next middleware
  next();
});

function handleGetMovie(req, res) {
  let response = MOVIES;
  //genre, country, or avg_vote
  const { genre, country, avg_vote} = req.query;

  if(genre) {
    response = response.filter(movie =>
      movie.genre.toLowerCase().includes(genre.toLowerCase()));
  }

  if(country) {
    response = response.filter(movie =>
      movie.country.toLowerCase().includes(country.toLowerCase()));
  }

  if(avg_vote) {
    response = response.filter(movie =>
      Number(movie.avg_vote) >= Number(avg_vote)
    );
  }

  res.json(response);
}

app.get('/movie', handleGetMovie);


app.listen(8000, () => {
  console.log('Server listening at http://localhost:8000');
});