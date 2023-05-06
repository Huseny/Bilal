import * as mongoose from 'mongoose';
export const EvaluationSchema = new mongoose.Schema({
  name: String,
  fields: Array<Object>,
});

export interface Evaluation extends mongoose.Document {
  name: string;
  fields: Array<Object>;
}
