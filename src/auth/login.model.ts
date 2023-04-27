/* eslint-disable prettier/prettier */
import * as mongoose from "mongoose";
export const LoginSchema=new mongoose.Schema({
    name:{type:String,required:true,},
    password:{type:String,required:true},
    hashedRt:{type:String},
    role:{type:String,required:true},
})
export interface Login{
    id:string;
    name:string;
    password:string;
    hashedRt:string;
    role:string,
}