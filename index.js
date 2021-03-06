const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nzfaw.mongodb.net/emaJohnDatabase?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());
const port = 5000;
app.get('/',(req, res)=>{
    res.send("working")
})
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
    const productCollection = client.db("emaJohnDatabase").collection("orders");
    const orderCollection = client.db("emaJohnDatabase").collection("ordersNew");
    app.post('/addProducts', (req, res) => {
        const product = req.body;
        console.log(product)
        productCollection.insertOne(product)
            .then(result => {
                console.log(result.insertedCount)
                res.send(result.insertedCount)
            })
    })


    app.get('/products', (req, res) => {
        productCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    app.get('/product/:key', (req, res) => {
        productCollection.find({key: req.params.key})
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })


    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productCollection.find({key: { $in: productKeys} })
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })
    
    app.post('/addOrders', (req, res) => {
        const order = req.body;
        
        orderCollection.insertOne(order)
            .then(result => {
                console.log(result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })






    //client closing bracket
});

app.listen(process.env.PORT || port)