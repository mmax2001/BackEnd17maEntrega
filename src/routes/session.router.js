import { Router } from "express";
import __dirname from "../../utils.js";
import userData from "../models/users.js";

const router = Router();

router.post('/registro',async (req,res)=>{
    let users=await userData.find();
    console.log(users);
    res.send(users);
    const {nombre,apellido,email} =req.body;
    if(!nombre||!apellido||!email) return res.status(400).send({error:"Incomplete values"})
    let user = {
        nombre,
        apellido,
        email
    }   
     try{
        const result = await userData.create(user);
        res.send({status:'success',payload:result})
    }catch(error){
        //res.status(500).send({error:error})
        res.status(500)
    }

})


router.post('/login',async(req,res)=>{
    console.log("REQ BODY",req.body);
    try{
        const {email} = req.body;
        console.log("ESTO TIENE EMAIL",email);
        if(!email) return res.status(400).send({error:"Incomplete values"})
        const user = await userData.findOne({email:email},{nombre:1,apellido:1,email:1});
        console.log("ESTO TIENE USER",user)
        if(!user) return res.status(400).send({error:'User not found'});
        req.session = user;
        console.log("ESTO TIENE req.session",req.session.email)
        //console.log(path.join(process.cwd(),'/public/dashboard.html'))
        res.send({status:"success ",payload:user})
        //return res.redirect('/dashboard.html');
        //res.redirect('/dashboard');
        //res.sendFile(path.join(process.cwd(),'/public/dashboard.html'))
        //res.sendFile(path.join(process.cwd(), '/layouts/views/login.hbs'))
    }catch(error){
        res.status(500).send({error:error})
    }
})

router.get('/logout',async(req,res)=>{
    req.session.destroy(err=>{
        if(err) return res.status(500).send("error");
        res.send("ok :)")
    })
})

export default router;