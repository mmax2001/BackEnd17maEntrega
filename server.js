import express from 'express';
import config from './config/config.js';
import { Server as HttpServer } from 'http'
import { Server as Socket } from 'socket.io'
import handlebars from 'express-handlebars';
import { Router } from 'express';
import ContenedorAPI from './ContenedorAPI.js';
import MsjsAPI from './MensajesAPI.js';
import { productosLista } from './datasets/productosLista.js';
import {mensajesLista} from './datasets/mensajes.js';
import { productosFaker } from './indexFaker.js';
import {dict} from './random.js'
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import store from 'session-file-store';
import viewsRouter from './src/routes/views.router.js';
import sessionRouter from './src/routes/session.router.js';

import { knexMySql } from './options/mariaDB.js';
import { knexSqLite } from './options/mySqlite3.js';
import { createTable,createMessagesTable } from './createTable.js';
import __dirname from './utils.js'
import SqlContainer from './SqlContainer.js';
import path from 'path'
import info from './public/js/info.js';
import compression from 'compression';
import { logger } from './utils.js';
//const FileStore=store(session)

const app = express();
const connection=mongoose.connect(config.MONGO_URL)
const router=Router();

const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

//Configuro el middleware para leer formato json desde el cliente al servidor y cookies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

router.use(express.json());
router.use(express.urlencoded({ extended: true }))
viewsRouter.use(express.json());
viewsRouter.use(express.urlencoded({ extended: true }))

//Lineas para Handlebars
app.engine('hbs', handlebars.engine(
    {
       extname:'.hbs',
       //defaultLayout:'layout.hbs',
       layoutsDir:__dirname + '/public/layouts/views/',
    }
)
);
app.set('view engine', 'hbs');
app.set('views',__dirname+ '/public/layouts/views');

//Indico que quiero cargar los archivos estaticos que se 
//encuentran en dicha carpeta declarada
app.use(express.static('./public'))

app.use(logger());
app.use('/',viewsRouter);
app.use('/registro',viewsRouter);
app.use('/login',viewsRouter);

app.use('/',sessionRouter)
app.use('/login',sessionRouter);
app.use('/registro',sessionRouter);
app.use(compression());

const productos=productosFaker;
const title='Faker';


app.get('/info',(req,res)=>{
    console.log(info)
    console.log(JSON.stringify(process.memoryUsage))
    req.logger.info('Se hizo una peticion a la ruta /info')
    res.render('info',{info});
})

app.get('/api/productos-test',(req,res)=>{
    req.logger.info('Se hizo una peticion a la ruta api/productos-test')
    res.render('layout',{productos,title})
})

const numbers=dict;
app.get('/api/random',(req,res)=>{
    req.logger.info('Se hizo una peticion a la ruta api/random')
    res.render('numbersTable',{numbers})
})

app.get('/dashboard/',(req,res)=>{
    //res.send(productosFaker);
    //req.logger.error('Error obteniendo productos')
    req.logger.info('Se hizo una peticion a la ruta /dashbord')
    res.sendFile(path.join(process.cwd(), '/public/dashboard.html'))
    
})

//Inicializo las tablas dentro de las bases MySQL y SQLite
const initializeDB = async () => {
   await createTable(knexMySql);
   await createMessagesTable(knexSqLite);
}

initializeDB();

//Configuro el medio de almacenamiento para los productos y mensajes
//del chat ya sea usando memoria y archivo o base de datos
const dataBaseSupport = false;
let ContenedorProductos;
let ChatMsjs;
if(dataBaseSupport) {
   ContenedorProductos = new SqlContainer(knexMySql,"productos");
   ChatMsjs=new SqlContainer(knexSqLite,"mensajes");
} else {
   ContenedorProductos= new ContenedorAPI();
   ContenedorProductos.prodListAPI=productosLista;
   ChatMsjs= new MsjsAPI('mensajes');
}

//Declaro la conexcion a la base en Mongo Atlas para guardar las sesiones de usuario
app.use(session({
    //time to live
    store:MongoStore.create({
        mongoUrl:config.MONGO_URL,
        mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true},
        ttl:100
    }), 
    secret:"WordSecret",
    resave:false,
    saveUninitialized:false
}))


//configuro la conexion para enviar mensajes desde el servidor al cliente 
//con el nombre del evento 'connection' y una funcion de callback
io.on('connection',async (socket)=>{
    console.log('Cliente conectado')
    // socket.emit('mi mensaje','Este es mi mensaje desde el servidor')
    
    //Cargo la lista de productos inicialmente
    socket.emit('listadoProductos',await ContenedorProductos.getAll());
    socket.emit('listadoFaker',productosFaker);

    //Recibo la carga de productos desde un cliente y la
    //emito a todos los demas clientes
    socket.on('ingresoProducto', product => {
        ContenedorProductos.save(product)
        io.sockets.emit('listadoProductos', ContenedorProductos.getAll());
    })
    
    //Cargo los mensajes previos
    socket.emit('mensajes', await ChatMsjs.getAll());
    //socket.emit('mensajes',listaMensajes); USANDO SQLITE
    
    //Muestro los nuevos mensajes
    socket.on('ingresoMensaje', async mensaje => {        
        await ChatMsjs.save(mensaje)
        io.sockets.emit('mensajes', ChatMsjs.getAll());
    })
    
})

//Dejo el servidor configurado en el puerto 3000
const PORT=config.PORT
const server=httpServer.listen(PORT,()=>console.log('SERVER ON' ,PORT));
server.on("error",error=>console.log(`Error en el servido ${error}`))
