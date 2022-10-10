import {fileURLToPath} from 'url'
import { dirname } from 'path'
import winston from 'winston';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const infoLogger = winston.createLogger({
    transports:[
        new winston.transports.Console({level:'info'}),
        new winston.transports.Console({level:'warn'}),
        new winston.transports.Console({level:'error'}),
        new winston.transports.File({level:'warn',filename:'warn.log'}),
        new winston.transports.File({level:'error',filename:'error.log'})
    ]
});

//Dejo configurado el middleware para mi logger de errores
export const logger = () => (req,res,next) =>{
    req.logger = infoLogger;
    next();
}

export default __dirname;