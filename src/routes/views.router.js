// const express = require('express');
// const router = express.Router();
import { Router } from "express";
import { logger } from "../../utils.js";

const viewsRouter=Router();
viewsRouter.use(logger());

viewsRouter.get('/login',(req,res)=>{
    req.logger.info('Se hizo una peticion a la ruta /login')
    if(req.session) return res.redirect('/dashboard');
    res.render('login');
    console.log("REQ",req.session)
})

viewsRouter.get('/registro',(req,res)=>{
    req.logger.info('Se hizo una peticion a la ruta /registro')
    res.render('register');
})

// viewsRouter.get('/',(req,res)=>{
//     if(!req.session.email) return res.redirect('/login');
//     //res.render('dashboard',{user:req.session.user});
//     //res.redirect('/dashbord')
// })

// viewsRouter.get('/',(req,res)=>{
//     if(!req.session.user) return res.redirect('/login');
//     res.render('dashboard',{user:req.session.user});
// })

// viewsRouter.get('/registro',(req,res)=>{
//     if(req.session.user) return res.redirect('/');
//     res.render('register');
// })

// viewsRouter.get('/login',(req,res)=>{
//     if(req.session.user) return res.redirect('/');
//     res.render('login');
// })
//module.exports={viewsRouter}
export default viewsRouter;