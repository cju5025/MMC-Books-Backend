const express = require ('express');
const app = express(); 

const cors = require('cors');
app.use(cors());

const knex = require('knex');
const config = require('./knexfile')[process.env.NODE_ENV || "development"];
const database = knex(config);

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Model } = require('objection');
Model.knex(database);

require('dotenv').config();

const User = require('./Models/User');

app.get('/', ( request, response ) => {
    response.json({"message": "serving" })
})

app.post('/users', ( request, response ) => {
    const { user } = request.body
    bcrypt.hash(user.password, 12)
        .then(hashedPassword => {
            return database('user')
                .insert({
                    username: user.username,
                    email: user.email,
                    password: hashedPassword
                }).returning('*')
        })
        .then(users => {
            const user = users[0]
            response.json({ user })
        }).catch(error => response.json(error.message))
})

app.post('/login', ( request, response ) => {
    const { user } = request.body

    database('user')
        .select()
        .where({ email: user.email })
        .first()
        .then(retrievedUser => {
            if (!retrievedUser) throw new Error ('Incorrect email or password')

            return Promise.all([
                bcrypt.compare(user.password, retrievedUser.password),
                Promise.resolve(retrievedUser)
            ])
        }).then(results => {
            const arePasswordsTheSame = results[0]
            const user = results[1]

            if (!arePasswordsTheSame) throw new Error('Incorrect email or password')

            const payload = { email: user.email }
            const secret = process.env.JWT_SECRET 

            jwt.sign(payload, secret, (error, token) => {
                if (error) throw new Error("Signing didn't work")
                response.json({ user, token })
            })
        }).catch(error => response.json(error.message))
})

app.get('/users', ( request, response ) => {
    User.query()
        .then(users => {
            response.json({ users })
        })
})

app.listen(4000, () => console.log('Listening'));