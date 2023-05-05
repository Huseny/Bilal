import * as mongoose from 'mongoose';
export const ClassSchema = new mongoose.Schema({
  className: String,
  dateCreated: Date,
});

export interface Class extends mongoose.Document {
  className: string;
  dateCreated: Date;
}
