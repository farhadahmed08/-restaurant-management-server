const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ObjectId,ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;



app.use(express.json());
app.use(cors());


const uri = "mongodb://0.0.0.0:27017/";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri);
// const uri = "mongodb+srv://farhad08:rNhsca82vZJgKGAD@cluster0.qaohrfy.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);







  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
  
      const foodCollection = client.db("restaurantManagement").collection("foods");
      const userCollection = client.db('restaurantManagement').collection('user');
    //   const orderCollection = client.db("carDoctor").collection("bookings");
      
      
      
  
        
        
        
  
    


    app.post('/users', async(req,res)=>{
        const user = req.body;
        console.log(user);
        const result = await userCollection.insertOne(user);
        res.send(result);
      })
  
  
  
      
      
      //foods related api
      app.get("/foods", async (req, res) => {
        const filter = req.query;
        console.log(filter)
         const query ={
        //   // price:{$gt:10}
          
          foodName:{$regex:filter.search,$options: "i"}
         };
         const options = {
        //   // Sort matched documents in descending order by rating
            sort: { 
              price: filter.sort === 'asc' ? 1 :  -1
             },
  
         
          
        };
        const cursor = foodCollection.find(query, options);
        // const cursor = serviceCollection.find(query, options);
        const result = await cursor.toArray();
        res.send(result);
      });
      
  
      app.get("/foods/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
  
  
        const result = await foodCollection.findOne(query);
        res.send(result);
      });
  
      
  
     
  
  
  
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }
  run().catch(console.dir);
  
  app.get("/", (req, res) => {
    res.send("port is running");
  });
  
  app.listen(port, () => {
    console.log(`Port is running on ${port}`);
  });
  