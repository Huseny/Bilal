import { HttpCode, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Abscent } from './abscence.model';
import { Mark } from './mark.model';
import { Student, TakenDays } from './student.model';
import { Section } from './student.model';
import { Parent } from 'src/models/Parent.model';
import { Class } from 'src/models/class.model';
import { ChildProcess } from 'child_process';
const nodemailer = require('nodemailer');

@Injectable()
export class StudentService {
  constructor(
    @InjectModel('Student') private student: Model<Student>,
    @InjectModel('Abscent') private abscent: Model<Abscent>,
    @InjectModel('Mark') private mark: Model<Mark>,
    @InjectModel('Section') private section: Model<Section>,
    @InjectModel('TakenDays') private takenDays: Model<TakenDays>,
    @InjectModel('Parent') private parent: Model<Parent>,
    @InjectModel('Class') private Class: Model<Class>,
  ) {}

  async addstudent(
    fullName: string,
    age: number,
    musteweTeilim: string,
    sex: string,
    subCity: string,
    wereda: string,
    kebele: string,
    specialNameOfArea: string,
    homeNo: number,
    familyNo: number,
    MesderAdukhul: string,
    ChooseParent: string,
    chooseClass: string,
  ) {
    const newStudent = new this.student({
      fullName,
      age,
      musteweTeilim,
      sex,
      subCity,
      wereda,
      kebele,
      specialNameOfArea,
      homeNo,
      familyNo,
      MesderAdukhul,
      ChooseParent,
      chooseClass,
    });
    const studentId = await newStudent.save();
    return studentId;
  }
  async addparent(
    fullName: string,
    sex: string,
    phoneNo: string,
    email: string,
    address: string,
  ) {
    const newParent = new this.parent({
      fullName,
      sex,
      phoneNo,
      email,
      address,
    });
    const parentId = await newParent.save();
    return parentId;
  }

  async addabscent(studentId: string, dateofabscent: string) {
    const newAbscent = new this.abscent({
      studentId,
      dateofabscent,
    });

    const abscentId = await newAbscent.save();
    return abscentId;
  }

  async addclass(className: string, dateStarted: Date, dateEnded: Date) {
    const newClass = new this.Class({
      className,
      dateStarted,
      dateEnded,
    });

    const classId = await newClass.save();
    return classId;
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
    fullName,
    age,
    musteweTeilim,
    sex,
    subCity,
    wereda,
    kebele,
    specialNameOfArea,
    homeNo,
    familyNo,
    MesderAdukhul,
    ChooseParent,
    chooseClass,
  ) {
    try {
      let studentDetail = await this.student.find({
        _id: studentId,
      });
      let newStudent = studentDetail[0];
      if (newStudent) {
        newStudent.fullName = fullName;
        newStudent.age = age;
        newStudent.musteweTeilim = musteweTeilim;
        newStudent.sex = sex;
        newStudent.subCity = subCity;
        newStudent.wereda = wereda;
        newStudent.kebele = kebele;
        newStudent.specialNameOfArea = specialNameOfArea;
        newStudent.homeNo = homeNo;
        newStudent.familyNo = familyNo;
        newStudent.MesderAdukhul = MesderAdukhul;
        newStudent.ChooseParent = ChooseParent;
        newStudent.chooseClass = chooseClass;
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
  async sendmail(receiver: string, username: string, password: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'husenyusuf876@gmail.com',
        pass: 'zfuteuwiogrjifyc',
      },
    });
    const mailOptions = {
      from: 'husenyusuf876@gmail.com',
      to: receiver,
      subject: 'የምዝገባ ማረጋገጫ',
      text: `السلام عليكم ورحمة الله وبركاته\nወደ ሲስተሙ በተሳካ ሁኔታ ተመዝግበዋል። የሚከተሉትን መረጃዎች በማስገባት ወደ ሲስተሙ መግባት ይችላሉ።\n\nUsername: ${username}\nPassword: ${password}\n\n\nቢላል መስጂድ እና መድረሳ`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    return true;
  }
}
