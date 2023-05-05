import * as mongoose from 'mongoose';

export const StudentSchema = new mongoose.Schema({
  fullName: String,
  age: Number,
  musteweTeilim: Number,
  sex: String,
  subCity: String,
  wereda: String,
  kebele: String,
  specialNameOfArea: String,
  homeNo: Number,
  familyNo: Number,
  MesderAdukhul: String,
  ChooseParent: String,
  chooseClass: String,
});

export const SectionSchema = new mongoose.Schema({
  sectionName: String,
  dateCreated: String,
});

export const TakenDays = new mongoose.Schema({
  date: String,
});

export const UstazSchema = new mongoose.Schema({
  ustazName: String,
  password: String,
  phoneNo: Number,
  email: String,
  address: String,
});

export interface Student extends mongoose.Document {
  fullName: string;
  age: number;
  musteweTeilim: number;
  sex: string;
  subCity: string;
  wereda: string;
  kebele: string;
  specialNameOfArea: string;
  homeNo: number;
  familyNo: number;
  MesderAdukhul: string;
  ChooseParent: string;
  chooseClass: string;
}

export interface Section extends mongoose.Document {
  sectionName: string;
  dateCreated: string;
}

export interface Ustaz extends mongoose.Document {
  ustazName: string;
  password: string;
  phoneNo: number;
  email: string;
  address: string;
}

export interface TakenDays extends mongoose.Document {
  date: string;
}
