import * as mongoose from 'mongoose';

export const StudentSchema = new mongoose.Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  studentAge: Number,
  studentClass: String,
  dateCreated: String,
});

export const SectionSchema = new mongoose.Schema({
  sectionName: String,
  dateCreated: String,
});

export const TakenDays = new mongoose.Schema({
  date: String,
});

export interface Student extends mongoose.Document {
  firstName: string;
  middleName: string;
  lastName: string;
  studentAge: number;
  studentClass: string;
  dateCreated: string;
}

export interface Section extends mongoose.Document {
  sectionName: string;
  dateCreated: string;
}

export interface TakenDays extends mongoose.Document {
  date: string;
}
