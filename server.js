const express = require('express')
const app = express()
const cors = require('cors')
const {MongoClient, ObjectID, ObjectId} = require('mongodb')
const { response } = require('express')
const { request } = require('http')
require('dotenv').config()
const PORT = 8000

let db, 
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'nationalParksDB',
    collection

MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log('Connected to database')
        db = client.db(dbName)
        collection = db.collection('Parks')
})

app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(express.static('public'))
app.use(express.json())
app.use(cors())

app.get('/', async (request, response) => {
    try {
        response.sendFile(__dirname + '/index.html')
    } catch (error) {
        response.status(500).send({message: error.message})
    }
})

app.get('/search', async (request, response) => {
    try{
        let result = await collection.aggregate([
            {
                "$search" : {
                    "autocomplete" : {
                        "query" : `${request.query.query}`,
                        "path" : "title",
                        "fuzzy" : {
                            "maxEdits" : 2,
                            "prefixLength" : 1
                        }
                    }
                }
            }
        ]).toArray()
        response.send(result)
    }catch (error){
        response.status(500).send({message: error.message})
        console.log(error)
    }
})

app.get("/get/:id", async (request, response) =>{
    try {
        let result = await collection.findOne({
            "_id" : ObjectId(request.params.id)
        })
        response.send(result)
    }catch (error){
        response.status(500).send({message: error.message})
    }
})

app.listen(process.env.PORT || PORT, () => {
    console.log('Server is running.')
})
