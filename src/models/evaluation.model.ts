import * as mongoose from 'mongoose';
export const EvaluationSchema = new mongoose.Schema({
  name: String,
  type: String,
  option: String,
});

export interface Evaluation extends mongoose.Document {
    name: string;
    type: string;
    option: string;
}