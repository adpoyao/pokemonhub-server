'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {PORT, CLIENT_ORIGIN} = require('./config');
const {dbConnect} = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const app = express();

let pokeData = [
  {trainer: 'Eddie',
    pokemons: ['Reunculus', 'Frosslass', 'Geninja', 'Venusaur', 'Ho-oh', 'Starmie']}, 
  {trainer: 'Andy',
    pokemons: ['Dragonite', 'Clefairy', 'Jirachi', 'Nidoking', 'Altaria', 'Decidueye']}
];

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.get('/api/pokemon', (req, res) => {
  res.json(pokeData);   
});

app.post('/api/pokemon', jsonParser, (req, res) => {
  const {trainer, pokemon} = req.body;
  pokeData.forEach(data => {
    if(data.trainer === trainer){
      data.pokemons.push(pokemon);
      // data.pokemons = [...data.pokemons, pokemon];
    }
    res.json(pokeData);
  });
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = {app};
