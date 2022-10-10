import dotenv from 'dotenv';
import minimist from 'minimist';

const args=minimist(process.argv.slice(2))
console.log(args.PORT)
console.log(args.MODO)

dotenv.config();
export default{
    PORT:args.PORT||process.env.PORT,
    MONGO_URL:process.env.MONGO_URL,
    MODO:args.MODO
}