const {MongoClient} = require("mongodb");
const express = require("express");
const app = express();

const url="mongodb://localhost:27017/sch_core"

const client=new MongoClient(url);

function connectToMongoDB(){

}

async function connectToMongoDB(){
    try{
        await client.connect();
        
const db=client.db("smartCoreSuite");
const usersCollection=db.collection("users");
const data=await usersCollection.find({}).toArray();
console.log("Users in DB:", data);
        console.log("Connected to MongoDB");
    }catch(err){
        console.error("Error connecting to MongoDB", err);
    }   }
connectToMongoDB();
