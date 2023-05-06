import * as mongoose from 'mongoose';
export const ParentSchema = new mongoose.Schema({
  fullName: String,
  sex: String,
  phoneNo: String,
  email: String,
  address: String,
});

export interface Parent extends mongoose.Document {
  fullName: string;
  sex: string;
  phoneNo: string;
  email: string;
  address: string;
}
