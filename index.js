const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());

//wHDoL4Y35JrzVepo
// simpleDbUser
const uri = "mongodb+srv://simpleDbUser:wHDoL4Y35JrzVepo@cluster0.nlnjuiz.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send('simple crud server is running ');
})

async function run() {
    try {
        await client.connect();
        const userDB = client.db("userDB");
        const usercollection = userDB.collection("user")
        app.get('/users', async (req, res) => {
            const cursor = usercollection.find();
            const result = await cursor.toArray();
            res.send(result);

        })

        app.get('/users/:id', async(req,res)=>{
            const id=req.params.id;
            console.log('need user with id',id);
            const query={_id: new ObjectId(id)}
            const result=await usercollection.findOne(query)
            res.send(result)
        })

        //  add database related api
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            console.log('user info', newUser);
            const result = await usercollection.insertOne(newUser);
            res.send(result)
        })

        app.patch('/users/:id',async(req,res)=>{
            const id=req.params.id;
            console.log(id);
            const updateuser=req.body;
            const query={_id: new ObjectId(id)}
            const update={
                $set:{
                    name:updateuser.name,
                    email:updateuser.email
                }
            }
            const options ={}
            const result=await usercollection.updateOne(query,update,options);
            console.log(result);
         res.send(result);
            

        })

        app.delete('/users/:id',async(req,res)=>{
          const id=req.params.id;
            const query={_id : new ObjectId(id)}
            const result= await usercollection.deleteOne(query);
            res.send(result)
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    }
    finally {

    }
}
run().catch(console.dir)

app.listen(port, () => {
    console.log(`simple crud server is running on port ${port}`);
})