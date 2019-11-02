const express = require('express')
const app = express()
const pokemonRouter = require('./pokemons/router')
const pokemonRouterV2 = require('./pokemons/routerV2')
const userRouter = require('./users/router')

//Register middleware
app.use(express.json())

app.use(pokemonRouter)

app.use('/V2',pokemonRouterV2)

app.use(userRouter)

module.exports = app