const express=require("express")
const mongoose=require("mongoose")
const app=express()
const cors=require("cors")
// const data=require("../server/data.js")
const bodyParser = require("body-parser")
const { Router } = require("express")
app.use(bodyParser.urlencoded({
    extended:true
}));
 const db_conection = async()=>{
    var uri = `mongodb://user:12345@ac-tl6fs42-shard-00-00.zabd7rl.mongodb.net:27017,ac-tl6fs42-shard-00-01.zabd7rl.mongodb.net:27017,ac-tl6fs42-shard-00-02.zabd7rl.mongodb.net:27017/?ssl=true&replicaSet=atlas-wi9ytg-shard-0&authSource=admin&retryWrites=true&w=majority`
   try{
  await mongoose.connect(uri , {useNewUrlParser :true})
  console.log("conected")
   }catch(err){
    console.log("not conected" ,err.message)
   }
  }

db_conection();
app.use(cors())

const DogSchema=mongoose.Schema({
  id :String ,
  Link:String ,
})
const Signupusers=mongoose.Schema({
    firstName:String ,
    lastName:String ,
    email:String ,
    password:String
  })
//modal
const Dogimage=mongoose.model("Dogimage",DogSchema)
const SignupuserDog=mongoose.model("SignupuserDog",Signupusers)


const readItem=async()=>{
    try{
        const res=await Dogimage.find();
        console.log(res)
    
    }catch(err){
        console.log(err)
    }
}
// readItem()

// creat route
const route=express.Router();
route.get('/',async(req,res)=>{
    try{
     const data= await Dogimage.find({})
     console.log(data)
      res.status(200).json(data)
    }catch(err){
        res.status().json(500).json({message:data.message})
    }
})
app.use(express.json())
route.post("/post", async(req, res)=> {
try{
  let Link =req.body.input
   Link=`https://dog.ceo/api/breed/${Link}/images/random`
  console.log(Link)
    Dogimage.insertMany({Link})
    let data=await Dogimage.find({})
    
    console.log(data)

    res.send("Added")
   
}catch(err){
    console.log(err.message)
}
  });
  app.post('/' ,async(req,res)=>{
 try{
    let _id=req.body.id
    console.log(_id)
   let data=await Dogimage.deleteOne({_id})
   console.log(data)
 }catch(err){
    console.log(err.message)
 }
})
app.post("/signup" , async(req,res)=>{
  console.log("req",req.body)
  let firstName=req.body.firstName
  let lastName=req.body.lastName
  let email=req.body.email
  let password=req.body.firstName
  SignupuserDog.insertMany({firstName ,lastName ,email ,password})
})
app.post("/login" , async(req,res)=>{
    console.log("req",req.body)
    
    let email=req.body.email
    let password=req.body.password
    // console.log(email ,password)
    let token=(Math.random(20)*100000000000000000000).toFixed(0)
    let data=await SignupuserDog.findOne({email , password})
    if(data){ 
        let status=200
        res.send({token ,status})
    }else{
        res.send("Plesase signup")
    }
    
  })
app.use('/signup',route)
app.use('/login',route)
app.use('/post',route)
app.use('/',route)

app.listen(5500,()=>{
    console.log("server is runing 5500")
})
