const express = require("express");
const app = express();
const cors = require('cors');




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
      const orderItemsCollection = client.db('restaurantManagement').collection('orderedItems');
      const myAddedItemsCollection = client.db('restaurantManagement').collection('myAddedItems');
   
      
      
      //jwt related api
    app.post('/jwt',async(req,res)=>{
      const user = req.body;
      const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:'1h'
      });
      console.log(token)
      res.send({token}); //short hand
    })


     //middleware
     const verifyToken = (req,res,next)=>{
      console.log('inside verify token',req.headers.authorization);
      if (!req.headers.authorization) {
        return res.status(401).send({message:'unauthorized access'})
      }
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if (err) {
          return res.status(401).send({message:'unauthorized access'})
        }
        req.decoded = decoded;
        next();
      })
     
    }
  
        
        
        
  
    

//users
    app.post('/users', async(req,res)=>{
      const user = req.body;
      const query = {email:user.email}
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({message:'user already exists',insertedId:null})
      }

      const result = await userCollection.insertOne(user);
      res.send(result);
    })
  
  
  
      
      
      //foods related api

      app.get('/foods', async(req, res) =>{
        const result = await foodCollection.find().toArray();
        res.send(result);
    });


   


    // app.get("/foods", verifyToken, async (req, res) => {
    //   // console.log(req) 1 ta obj asbe jekhane token ,user soho ro data asbe

    //   // const queryEmail = req.query.email;
    //   // const userEmail = req.query.email
      
    //   console.log(req.query.email);
    //   // console.log('tok tok token',req.cookies.token)
    //   console.log('user in the valid token',req.user)
    //   if (req.query.email !== req.user.email) {
    //     return res.status(403).send({message:'forbidden access'})
    //   }


    //   let query = {};
    //   if (req.query?.email) {
    //     query = { email: req.query.email };
    //   }
    //   const result = await foodCollection.find(query).toArray();
    //   res.send(result);
    // });







      // app.get("/foods", async (req, res) => {
      //   const filter = req.query;
      //   console.log(filter)
      //    const query ={
      //   //   // price:{$gt:10}
          
      //     foodName:{$regex:filter.search,$options: "i"}
      //    };
      //    const options = {
      //   //   // Sort matched documents in descending order by rating
      //       sort: { 
      //         price: filter.sort === 'asc' ? 1 :  -1
      //        },
  
         
          
      //   };
      //   const cursor = foodCollection.find(query, options);
      //   // const cursor = serviceCollection.find(query, options);
      //   const result = await cursor.toArray();
      //   res.send(result);
      // });
      
  
      app.get("/foods/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await foodCollection.findOne(query);
        res.send(result);
      });


      app.post('/foods',verifyToken,async(req,res)=>{
        const item = req.body;
        console.log(item)
        const result = await foodCollection.insertOne(item);
        res.send(result)
      })
  


      app.patch('/foods/:id', async (req, res) => {
        const item = req.body;
        const id = req.params.id;
        const filter = { _id:new ObjectId (id) }
        const updatedDoc = {
          $set: {
            name: item.name,
            category: item.category,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          }
        }
  
        const result = await foodCollection.updateOne(filter, updatedDoc)
        res.send(result);
      })

      app.delete('/foods/:id',verifyToken, async(req,res)=>{
        const id = req.params.id;
        const query = {_id:new ObjectId (id)}
        const result = await menuCollection.deleteOne(query);
        res.send(result);
      })


      //order items
      app.get('/orderItems', async(req, res) =>{
        const email = req.query.email;
        const query = {email:email};
          const result = await orderItemsCollection.find(query).toArray();
          res.send(result);
      });

      app.post('/orderItems',async(req,res)=>{
        const orderItem = req.body;
        const result = await orderItemsCollection.insertOne(orderItem);
        res.send(result)
      });

      app.delete('/orderItems/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id:new ObjectId (id)}
        const result = await orderItemsCollection.deleteOne(query);
        res.send(result);
      })

      
      //myAdded
      app.get('/myAdded', async(req, res) =>{
        const email = req.query.email;
        const query = {email:email};
          const result = await myAddedItemsCollection.find(query).toArray();
          res.send(result);
      });



      app.get("/myAdded/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await myAddedItemsCollection.findOne(query);
        res.send(result);
      });


      app.post('/myAdded',async(req,res)=>{
        const myAddedItem = req.body;
        const result = await myAddedItemsCollection.insertOne(myAddedItem);
        res.send(result)
      });

      app.patch('/myAdded/:id', async (req, res) => {
        const item = req.body;
        const id = req.params.id;
        const filter = { _id:new ObjectId (id) }
        const updatedDoc = {
          $set: {
            name: item.name,
            category: item.category,
            email:item.email,
            price: item.price,
            origin:item.origin,
            quantity: item.quantity,
            image: item.image
          }
        }
  
        const result = await myAddedItemsCollection.updateOne(filter, updatedDoc)
        res.send(result);
      })
      
  
     
  
  
  
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
  