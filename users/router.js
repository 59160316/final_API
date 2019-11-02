const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const MongoClient = require('mongodb').MongoClient
const router = express.Router()

const jwtKey = 'supersecure'

const mongoUrl = 'mongodb+srv://59160316:a0147258369@pokemon-cluster-lypzl.gcp.mongodb.net/test?retryWrites=true&w=majority'

router.post('/register', async (req,res) => {
    let email = req.body.email
    let password = req.body.password
    let encryPwd = await bcrypt.hash(password,8)

    let client = await MongoClient.connect(mongoUrl, {useNewUrlParser:true,useUnifiedTopology:true}).catch((err) => {
        console.log(err)
        res.status(500).json({error:err})  
    })
    
    try{
        let db = client.db('buu')
        let result = await db.collection('user').insertOne({email: email,password:encryPwd})
        res.status(201).send({id:result.insertedId})
    }catch(err){
        console.error(err)  
        res.status(500).json({error:err})      
    }finally{
        client.close()
    }

})

router.post('/sign-in', async (req,res) => {
    let email = req.body.email
    let password = req.body.password

    let client = await MongoClient.connect(mongoUrl, {useNewUrlParser:true,useUnifiedTopology:true}).catch((err) => {
        console.log(err)
        res.status(500).json({error:err})  
    })

    try{
        let db = client.db('buu')
        let user = await db.collection('user').findOne({email:email})

        if(!user){
            res.status(401).json({error:`Email: ${email} is not exited`})
            return
        }

        let valid = await bcrypt.compare(password,user.password)
        if(!valid){
            res.status(401).json({error:'Your email or passwrd is incorrect'})
            return
        }

        let token = await jwt.sign(
            {email:user.email,id:user.id},
            jwtKey,
            {expiresIn: 120}
        )

        res.json({token:token})
       
    }catch(err){
        console.error(err)  
        res.status(500).json({error:err})      
    }finally{
        client.close()
    }

})

//Authorization of API
const auth = async (req, res, next) => {
    let token = req.header('Authorization')
    let decoded

    try {
        decoded = await jwt.verify(token, jwtKey)
        req.decoded = decoded
        next()
    }catch(err){
        console.error(`Invalid token: ${err}`)
        res.status(401).json({error:err})
        return
    }
}

router.get('/me',auth, async (req,res) => {

    let decoded = req.decoded.email

    let client = await MongoClient.connect(mongoUrl, {useNewUrlParser:true,useUnifiedTopology:true}).catch((err) => {
        console.log(err)
        res.status(500).json({error:err})  
    })

    try{
        let db = client.db('buu')
        let user = await db.collection('user').findOne({email:decoded})
        delete user.password
        res.json({data:user})
       
    }catch(err){
        console.error(err)  
        res.status(500).json({error:err})      
    }finally{
        client.close()
    }
})



module.exports = router