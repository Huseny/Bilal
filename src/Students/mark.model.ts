import * as mongoose from 'mongoose';

export const MarkSchema = new mongoose.Schema({
  studentId: String,
  date: String,
  surahName: String,
  startAyah: String,
  endAyah: String,
  scoreoutof10: Number,
});

export interface Mark extends mongoose.Document {
  id: string;
  studentId: string;
  date: string;
  surahName: string;
  startAyah: string;
  endAyah: string;
  scoreoutof10: number;
}
