const express = require('express')
const router = express.Router()

router.get('/pokemons/:id', (req,res) => {

    //Request Parameters 
    let id = req.params.id
    res.json({pokemon_id:id,api_version:2})
})

module.exports = router