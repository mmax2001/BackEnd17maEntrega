// const mongoose=require('mongoose');
// const {Schema,model}=mongoose;
import mongoose from "mongoose";

const usersCollection='users';

const userSchema = mongoose.Schema({
    nombre: {type:String,require:true,max:100},
    apellido: {type:String,require:false,max:100},
    email: {type:String,require:false},
    },{timestamps:true});

const userData=mongoose.model(usersCollection,userSchema);

// module.exports={userData};
export default userData;