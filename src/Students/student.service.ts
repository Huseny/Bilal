import { HttpCode, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Abscent } from './abscence.model';
import { Mark } from './mark.model';
import { Student, TakenDays } from './student.model';
import { Section } from './student.model';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel('Student') private student: Model<Student>,
    @InjectModel('Abscent') private abscent: Model<Abscent>,
    @InjectModel('Mark') private mark: Model<Mark>,
    @InjectModel('Section') private section: Model<Section>,
    @InjectModel('TakenDays') private takenDays: Model<TakenDays>,
  ) {}

  async addstudent(
    firstName: string,
    middleName: string,
    lastName: string,
    studentAge: number,
    studentClass: string,
    dateCreated: string,
  ) {
    const newStudent = new this.student({
      firstName,
      middleName,
      lastName,
      studentAge,
      studentClass,
      dateCreated,
    });
    const studentId = await newStudent.save();
    return studentId;
  }

  async addabscent(studentId: string, dateofabscent: string) {
    const newAbscent = new this.abscent({
      studentId,
      dateofabscent,
    });

    const abscentId = await newAbscent.save();
    return abscentId;
  }

  async getattendance() {
    return await this.abscent.find().exec();
  }

  async delAss(day: string) {
    await this.abscent.findOneAndRemove({ dateofabscent: day });
    return await this.takenDays.findOneAndDelete({ date: day });
  }

  async addDay(day: string) {
    const newTaken = new this.takenDays({
      date: day,
    });
    await newTaken.save();
  }

  async addscore(
    studentId: string,
    date: string,
    surahName: string,
    startAyah: string,
    endAyah: string,
    scoreoutof10: number,
  ) {
    const newMark = new this.mark({
      studentId,
      date,
      surahName,
      startAyah,
      endAyah,
      scoreoutof10,
    });

    const markId = await newMark.save();
    return markId;
  }

  async getmarks() {
    return await this.mark.find().exec();
  }

  async getdaymark(date: string) {
    return await this.mark.find({ date: date });
  }

  async gettotalmarks(studentId: string) {
    const totalMark = await this.mark.find({ studentId: studentId });
    return totalMark;
  }

  async getallstudents() {
    const listofstudents = await this.student
      .find()
      .sort({ firstName: 'asc' })
      .exec();
    return listofstudents;
  }
  async getallabscentdays(studentId: string) {
    const abscentdays = await this.abscent.find({ studentId: studentId });
    return abscentdays;
  }

  async deel() {
    let whate = 1;
    let st = 2;
    let mar = 3;
    let sec = 4;
    let td = 5;
    while (whate || st || mar || sec || td) {
      whate = await this.abscent.findOneAndRemove();
      st = await this.student.findOneAndRemove();
      mar = await this.mark.findOneAndDelete();
      sec = await this.section.findOneAndDelete();
      td = await this.takenDays.findOneAndDelete();
      console.log(whate, st, mar, sec, td);
    }
  }

  async gettaken() {
    let dateTook = await this.takenDays.find().exec();
    let dates = [];
    dateTook.forEach((element) => {
      dates.push(element.date);
    });
    return dates;
  }

  async deletedate() {
    let today = new Date().toISOString().slice(0, 10);
    let deletedate = await this.takenDays.findOneAndDelete({ date: today });
    return deletedate;
  }
  async editstudent(
    studentId: string,
    firstName: string,
    middleName: string,
    lastName: string,
    studentAge: number,
    studentClass: string,
  ) {
    try {
      let studentDetail = await this.student.find({
        _id: studentId,
      });
      let newStudent = studentDetail[0];
      if (newStudent) {
        newStudent.firstName = firstName;
        newStudent.middleName = middleName;
        newStudent.lastName = lastName;
        newStudent.studentAge = studentAge;
        newStudent.studentClass = studentClass;
        await newStudent.save();
        return newStudent;
      }
      return false;
    } catch {
      return false;
    }
  }
  async deletestudent(studentId: string) {
    const studentDetail = await this.student.findOneAndDelete({
      _id: studentId,
    });
    await this.abscent.findOneAndDelete({ studentId: studentId });
    await this.mark.findOneAndDelete({ studentId: studentId });
    return studentDetail;
  }

  async createsection(sectionName: string, dateCreated: string) {
    let newSection = new this.section({
      sectionName: sectionName,
      dateCreated: dateCreated,
    });
    newSection = await newSection.save();
    return newSection;
  }

  async getallsections() {
    let sections = await this.section.find().exec();
    return sections;
  }

  async getstudentbysection(sectionName: string) {
    let students = await this.student.find({ studentClass: sectionName });
    return students;
  }

  async editsection(sectionId: string, sectionName: string) {
    let mySection = await this.section.find({ _id: sectionId });
    let realSection = mySection[0];
    realSection.sectionName = sectionName;
    await realSection.save();
    return realSection;
  }

  async deleteclass(sectionId: string) {
    let mySection = await this.section.findOneAndDelete({ _id: sectionId });
    return mySection;
  }
}
