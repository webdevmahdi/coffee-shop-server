const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Coffee shop server is running');
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.obfo8nr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    let coffeeCollection = client.db('coffeeDB').collection('coffee');

    app.get('/coffee', async (req, res) => {
      let cursor = coffeeCollection.find();
      let result = await cursor.toArray();
      res.send(result);
    })

    app.get('/coffee/:id', async (req, res) => {
      let id = req.params.id;
      let query = { _id: new ObjectId(id) };
      let result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    app.put('/coffee/:id', async (req, res) => {
      let id = req.params.id;
      let filter = { _id: new ObjectId(id) }
      let updateCoffee = req.body;
      let options = { upsert: true };
      let coffeeUpdated = {
        $set: {
          form: updateCoffee.form,
          name: updateCoffee.name,
          quantity: updateCoffee.quantity,
          supplier: updateCoffee.supplier,
          taste: updateCoffee.taste,
          price: updateCoffee.price,
          details: updateCoffee.details,
          photo: updateCoffee.photo
        }
      }
      let result = await coffeeCollection.updateOne(filter, coffeeUpdated, options);
      res.send(result);
    })

    app.post('/coffee', async (req, res) => {
      let coffeeData = req.body;
      console.log(coffeeData);
      let result = await coffeeCollection.insertOne(coffeeData);
      res.send(result);
    })

    app.delete('/coffee/:id', async (req, res) => {
      let id = req.params.id;
      let query = { _id: new ObjectId(id) };
      let result = await coffeeCollection.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Server is running in port : ${port}`);
})