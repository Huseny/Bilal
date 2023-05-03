import * as mongoose from 'mongoose';
export const AdminSchema = new mongoose.Schema({
    fullName: String,
    password: String,

});

export interface Admin extends mongoose.Document {
    fullName: string;
    password: string;
}