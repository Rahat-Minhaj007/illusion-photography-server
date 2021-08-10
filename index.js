const express = require('express')
const MongoClient = require('mongodb').MongoClient;
// const MongoDb = require('mongodb');
const ObjectID = require('mongodb').ObjectId;


// const bodyParser = require('body-parser');

const cors = require('cors');
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a4w6n.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5055;




app.get('/', (req, res) => {
    res.send('Hello World!')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    console.log('connection error', err);

    const eventCollection = client.db("illusionPhoto").collection("services");
    const orderCollection = client.db("illusionPhoto").collection("orders");

    

    app.get('/service', (req, res) => {
        eventCollection.find()
            .toArray((err, items) => {
                res.send(items)

            })
    })

    app.post('/addService', (req, res) => {
        const newEvent = req.body;
        console.log('adding new event', newEvent);
        eventCollection.insertOne(newEvent)
            .then(result => {
                console.log('inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })


    app.get('/order', (req, res) => {
        orderCollection.find()
            .toArray((err, orderItems) => {
                res.send(orderItems)

            })
    })


    app.post('/addOrder', (req, res) => {
        const order = req.body;
        console.log('adding new order', order);
        orderCollection.insertOne(order)
            .then(result => {
                console.log('inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })


    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id);
        const id = ObjectID(req.params.id);
        eventCollection.deleteOne({ _id: id})

            .then(result => {

                console.log(result);
            })
    })




});


app.listen(port)
