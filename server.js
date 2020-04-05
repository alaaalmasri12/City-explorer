'use strict';
const express=require('express');
const app=express();

const PORT=process.env.PORT || 3000
const cors=require("cors");
const dotenv=require("dotenv").config();
app.use(cors());

app.get('/',(req,res)=>{
    res.status(200).send("page is working good");
})



app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})

app.use("*",(req,res)=>{
    res.status(404).send("404 Page Not Found");
})
app.use((error,req,res)=>{
    res.status(500).send(error);
})
