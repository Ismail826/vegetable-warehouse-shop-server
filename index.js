const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ujlaawp.mongodb.net/?retryWrites=true&w=majority`;

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
        const productCollection = client.db('vegetableWarehouse').collection('vgProduct');
        await client.connect();

        //Post data collect clint side to server side send
        app.post('/addItem', (req, res) => {
            const newProduct = req.body;
            const result = productCollection.insertOne(newProduct)
            res.send(result);
        });

        //json data pass server side to clint side

        app.get('/addItem', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const addItems = await cursor.toArray();
            res.send(addItems);
        });

        // json data pass single product server side to clint side
        app.get('/addItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const addItem = await productCollection.findOne(query)
            res.send(addItem);
        });

       

        // update quantity clint side to server side
        app.put('/addItem/:id', async (req, res) => {
            const id = req.params.id;
            const updateQuantity = req.body;
            const filter ={_id: new ObjectId(id)}
            const options = { upsert: true };

            const updateDoc={
                // $set:{updateQuantity}
                $set:{
quantity:updateQuantity.quantity
                }
            };

            const result = await productCollection.updateOne(filter, updateDoc, options)
            res.send(result);
        });

        app.delete('/addItem/:id', async(req,res)=>{
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })

    }

    finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }


}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('ismail')
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});