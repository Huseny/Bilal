import * as mongoose from 'mongoose';
export const ClassSchema = new mongoose.Schema({
    className: String,
    dateStarted: Date,
    dateEnded: Date

});

export interface Class extends mongoose.Document {
    className: string,
    dateStarted: Date,
    dateEnded: Date

}