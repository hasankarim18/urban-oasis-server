const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express()
require("dotenv").config();
const port = process.env.PORT || 5000 

// middleware 
app.use(cors())
app.use(express.json()) 


// env vaiable 
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;



const uri =
  `mongodb+srv://${db_user}:${db_password}@cluster0.nzfxe6e.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productDatabase = client.db("urbanOasisDB");
    const productCollection = productDatabase.collection("products");

    

    app.get('/products', async (req, res)=> {
        const query = req.query 
        
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10 
        const skip = (page * limit)
        const result = await productCollection.find().skip(skip).limit(limit).toArray()
         res.send(result)
    } )

    app.get('/totalProducts', async (req, res)=> {
      const result = await productCollection.estimatedDocumentCount()
    res.send({ totalProducts: result });
    } )

    app.post('/productsById', async (req, res)=> {
      const ids = req.body;     
       
   
      try {      
         
         const objectIds = ids.map(id =>new ObjectId(id))
          const query = { _id: { $in: objectIds } };
         const result = await productCollection.find(query).toArray();
         res.send(result);
      } catch (err) {
        console.error(err); // log the error to the console for debugging
        res.status(500).json({ error: "Internal server error" }); // send a 500 error response to the client
      }  
      
      // console.log(ids)



    } )


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  //  await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=> {
    res.send(`Enjoy your urban lifestyle from our oasis `);
} )

app.listen(port, ()=> {
    console.log("Urban Oasis is ready to make you broke");
})