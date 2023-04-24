import * as mongoose from 'mongoose';

export const AbscenceSchema = new mongoose.Schema({
    studentId: String,
    dateofabscent: String


});

export interface Abscent extends mongoose.Document{
    
         id: string;
         studentId: string;
         dateofabscent: string
    
}