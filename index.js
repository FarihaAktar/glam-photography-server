const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

const port = 4000;


app.get('/', function (req, res) {
    res.send('hello world....')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ssth5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db("glamStudio").collection("services");
    const adminCollection = client.db("glamStudio").collection("admins");
    const bookingCollection = client.db("glamStudio").collection("bookings");
    

    app.post('/addService', (req, res) => {
        const newService = req.body;
        serviceCollection.insertOne(newService)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    
    app.get('/admin', (req, res) => {
        adminCollection.find({ email: req.query.email })
            .toArray((err, admin) => {
                if (admin.length === 0) {
                    res.send([])
                }
                else {
                    adminCollection.find()
                        .toArray((err, documents) => {
                            res.send(documents)
                        })
                }
            })
    })

    app.get('/manageService', (req, res) => {
        serviceCollection.find()
            .toArray((err, services) => {
                res.send(services)
            })
    })

    
    app.delete('/delete/:id', (req, res) => {
        const id = ObjectId(req.params.id);
        console.log("delete this", id)
        serviceCollection.findOneAndDelete({ _id: id })
            .then(documents => res.send(!!documents.value))

    })


    app.get('/allServices', (req, res) => {
        serviceCollection.find()
            .toArray((err, services) => {
                res.send(services)
            })
    })

    app.get('/singleService/:id', (req, res) => {
        serviceCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, service) => {
                res.send(service)
            })
    })


    app.post('/addBooking', (req, res) => {
        const newBooking = req.body;
        bookingCollection.insertOne(newBooking)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/bookings', (req, res) => {
        bookingCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/manageBookings', (req, res) => {
        bookingCollection.find()
            .toArray((err, bookings) => {
                res.send(bookings)
            })
    })

    app.patch('/update/:id', (req, res)=>{
        const id = ObjectId(req.params.id);
        console.log(req.params.id)
        bookingCollection.updateOne({_id: id},
        {
            $set: {status: req.body.status}
        })
        .then(result =>{
            console.log(result)
        })

    })


});




app.listen(process.env.PORT || port)