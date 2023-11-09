const express = require("express");
require('dotenv').config();
const cors = require("cors");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ObjectId,ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    // origin:['http://localhost:5173'],
    origin:[

      'https://resturant-managment-40e01.web.app',
      'https://resturant-managment-40e01.firebaseapp.com'
    ],

    credentials:true 
  }));

app.use(express.json());
app.use(cookieParser());

// const uri = "mongodb://0.0.0.0:27017/";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri);
const uri = "mongodb+srv://farhad08:rNhsca82vZJgKGAD@cluster0.qaohrfy.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// middlewares made by us
// const logger = async(req,res,next)=>{
//   console.log('called:',req.host,req.originalUrl)
//   next();
// }


// const verifyToken = async(req,res,next)=>{
//     const token = req.cookies?.token; //token name e set korci tai get o korte parbo token name e .
//     console.log('value of token in middleware',token);
//     if (!token) {
//       return res.status(401).send({message:'unauthorized'})
//     }
//     jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
//       //error
//       if (err) {
//         console.log(err);
//         return res.status(401).send({message:'unauthorized access'})
//       }
  
//       //if token is valid then it would be decoded
//       console.log('value of the token',decoded)
//       req.user = decoded;// req.user, req er por j kono name dilei hoi
//       next();
//     })
//   }


  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
  
      const foodCollection = client.db("restaurantManagement").collection("foods");
      const userCollection = client.db('restaurantManagement').collection('user');
    //   const orderCollection = client.db("carDoctor").collection("bookings");
      
      
      
      //auth related api
    //   app.post('/jwt',logger,async(req,res)=>{
    //     const user = req.body;
    //     console.log(user);
    //     const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'})
        
        
        
        // set cookie
        // res
        // .cookie('token',token,{
        //   httpOnly:true,
        //   secure:false, 
          
        // })
        // .send({success:true});
        // res.send(token)
   
    //   })
  
    //   app.post('/logout',async(req,res)=>{
    //     const user =req.body;
    //     console.log('logging out',user); 
    //     res.clearCookie('token',{maxAge:0}).send({success:true})
    //   })


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
  
        // const options = {
        //   // Sort matched documents in descending order by rating
        //     sort: { "price": -1 },
  
        //   // Include only the `title` and `imdb` fields in the returned document
        //   projection: { 
        //     foodName: 1, price: 1, 
        //     quantity
        //     : 1, 
        //     foodImage: 1 },
        // };
  
        const result = await foodCollection.findOne(query);
        res.send(result);
      });
  
      //bookings
  
    //   app.get("/bookings", logger, verifyToken, async (req, res) => {
        
  
    //     // const queryEmail = req.query.email;
    //     // const userEmail = req.query.email
        
    //     console.log(req.query.email);
    //     // console.log('tok tok token',req.cookies.token)
    //     console.log('user in the valid token',req.user)
    //     if (req.query.email !== req.user.email) {
    //       return res.status(403).send({message:'forbidden access'})
    //     }
  
  
    //     let query = {};
    //     if (req.query?.email) {
    //       query = { email: req.query.email };
    //     }
    //     const result = await bookingCollection.find(query).toArray();
    //     res.send(result);
    //   });
  
    //   app.post("/bookings", async (req, res) => {
    //     const booking = req.body;
    //     console.log(booking);
    //     const result = await bookingCollection.insertOne(booking);
    //     res.send(result);
    //   });
  
  
    //   app.patch('/bookings/:id',async(req,res)=>{
    //       const id = req.params.id;
    //       const filter = {_id:new ObjectId(id)};
    //       const updatedBooking = req.body;
    //       console.log(updatedBooking);
    //       const updateDoc ={
    //           $set:{
    //               status:updatedBooking.status
    //           }
    //       }
    //       const result = await bookingCollection.updateOne(filter,updateDoc)
    //       res.send(result);
          
    //   })
  
  
      app.delete('/bookings/:id',async(req,res)=>{
          const id = req.params.id;
          const query = {_id:new ObjectId(id)}
          const result = await foodCollection.deleteOne(query);
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
  