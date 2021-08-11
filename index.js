const express = require ('express');
const app = express(); 
const knex = require('knex');
const config = require('./knexfile')[process.env.NODE_ENV || "development"];
const database = knex(config);

app.get('/', ( request, response ) => {
    response.json({"message": "serving"})
})

app.listen(4000, () => console.log('Listening'));