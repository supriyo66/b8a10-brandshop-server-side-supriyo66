const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express();
const port=process.env.PORT || 5000;

app.use(cors());
app.use(express.json());








const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r4tqjz5.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

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

    const foodCollection = client.db("foodDB").collection("food")


    app.get('/food',async(req,res)=>{
      const cursor=foodCollection.find();
      const result=await cursor.toArray();
      res.send(result);
    })

    app.get('/food/:id',async(req,res)=>{
      const id=req.params.id;
      const query={ _id: new ObjectId(id) };
      const result=await foodCollection.findOne(query)
      res.send(result)
    })

    app.put('/food/:id',async(req,res)=>{
      const id=req.params.id;
      const filter={_id:new ObjectId(id)};
      const options={upsert:true};
      const updatedFood=req.body;
      const food={
        name:updatedFood.name,
        brandName:updatedFood.brandName,
        foodType:updatedFood.foodType,
        price:updatedFood.price,
        description:updatedFood.des,
        rating:updatedFood.rating,
        photo:updatedFood.photo
      }
      const result=await foodCollection.updateOne(filter,food,options);
      res.send(result);
    })

    app.post('/food', async(req,res)=>{
        const newFood=req.body;
        
        console.log(newFood);
        const result = await foodCollection.insertOne(newFood);
        res.send(result)
    })
      


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
    res.send('food server running')
})

app.listen(port,()=>{
    console.log(`food:${port}`)
})