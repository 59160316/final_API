const express = require('express')
const MongoClient = require('mongodb').MongoClient
const router = express.Router()

const mongoUrl = 'mongodb+srv://59160316:a0147258369@pokemon-cluster-lypzl.gcp.mongodb.net/test?retryWrites=true&w=majority'

router.get('/pokemons', async (req,res) => {

    //Query String by name of pokemon --> localhost:3000/pokemons?name=Pikachu
    let name = req.query.name

    let client = await MongoClient.connect(mongoUrl, {useNewUrlParser:true,useUnifiedTopology:true}).catch((err) => {
        console.log(err)
        res.status(500).json({error:err})  
    })
    let db = client.db('pokemondb')

    try{
        let docs = await db.collection('pokemons').find({}).toArray()
        res.json(docs)
    }catch(err){
        console.error(err)  
        res.status(500).json({error:err})      
    }finally{
        client.close()
    }

  

})

router.get('/pokemons/:id', (req,res) => {

    //Request Parameters 
    let id = req.params.id
    res.json({pokemon_id:id})
})

router.post('/pokemons', async (req,res) => {

    // Request Body
    let p = req.body

    let client = await MongoClient.connect(mongoUrl, {useNewUrlParser:true,useUnifiedTopology:true}).catch((err) => {
        console.log(err)
        res.status(500).json({error:err})     
    })
    let db = client.db('pokemondb')

    try{
        let result = await db.collection('pokemons').insertOne(p)
        res.status(201).send({mssage:'Create pokemon successfully'})
    }catch(err){
        console.error(err)  
        res.status(500).json({error:err})      
    }finally{
        client.close()
    }

})

module.exports = router