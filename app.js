import express from 'express';
import { Server as HttpServer } from 'http'
import __dirname from './utils.js';
import { dict } from './random.js'
import handlebars from 'express-handlebars';
import config from './config/config.js';

const app = express();
//Configuro el middleware para leer formato json desde el cliente al servidor y cookies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Lineas para Handlebars
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    //defaultLayout:'layout.hbs',
    layoutsDir: __dirname + '/public/layouts/views/',
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/public/layouts/views');

//Indico que quiero cargar los archivos estaticos que se 
//encuentran en dicha carpeta declarada
app.use(express.static('./public'))

//Dejo el servidor configurado en el puerto 3000
const PORT = config.PORT
const httpServer = new HttpServer(app);
const server = httpServer.listen(PORT, () => console.log('SERVER ON', PORT));
server.on("error", error => console.log(`Error en el servido ${error}`))


const numbers = dict;
app.get('/api/random', (req, res) => {
    res.render('numbersTable', { numbers })
    console.log(`Servidor con pid ${process.pid} en puerto ${PORT}`)
})

app.get('/', (req, res) => {
    res.redirect('/api/random')
})