import { Body, Controller, Post, Get, Patch } from '@nestjs/common';
import { StudentService } from './student.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('student')
export class StudentController {
  constructor(private readonly studentservice: StudentService) {}

  @Post('addstudent')
  async createstudent(
    @Body('fullnName') fullName: string,
    @Body('studentAge') studentAge: number,
    @Body('musteweTeilim') musteweTeilim: string,
    @Body('sex') sex: string,
    @Body('subCity') subCity: string,
    @Body('wereda') wereda: string,
    @Body('kebele') kebele: string,
    @Body('specialNameOfArea') specialNameOfArea: string,
    @Body('homeNo') homeNo: number,
    @Body('familyNo') familyNo: number,
    @Body('MesderAdukhul') MesderAdukhul: string,
    @Body('ChooseParent') ChooseParent: string,
    @Body('chooseClass') chooseClass: string,    
    ) {
    const generatedId = await this.studentservice.addstudent(
      fullName,
      studentAge,
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
    );
    return { id: generatedId };
  }

  @Public()
  @Post('addparent')
  async createparent(
    @Body('fullName') fullName: string,
    @Body('sex') sex: string,
    @Body('phoneno') phoneNo: string,
    @Body('email') email: string,
    @Body('address') address: string,
  ){
    const generatedId = await this.studentservice.addparent(
      fullName,
      sex,
      phoneNo,
      email,
      address,
    );
    return {id: generatedId._id};
  }

  @Post('addabscent')
  async addabscent(
    @Body('studentId') studentId: string,
    @Body('dateofabscent') dateofabscent: string,
  ) {
    const abscentId = await this.studentservice.addabscent(
      studentId,
      dateofabscent,
    );

    return { id: abscentId };
  }

  @Post('addclass')
  async addclass(
    @Body('classname') className: string,
    @Body('datestarted') dateStarted: Date,
    @Body('dateEnded') dateEnded: Date,
  ) {
    const abscentId = await this.studentservice.addclass(
      className,
      dateStarted,
      dateEnded
    );

    return { id: abscentId };
  }
  

  @Post('addDate')
  async addDay(@Body('day') day: string) {
    return await this.studentservice.addDay(day);
  }

  @Post('addscore')
  async addscore(
    @Body('studentId') studentId: string,
    @Body('date') date: string,
    @Body('surahName') surahName: string,
    @Body('startAyah') startAyah: string,
    @Body('endAyah') endAyah: string,
    @Body('score') score: number,
  ) {
    const markId = await this.studentservice.addscore(
      studentId,
      date,
      surahName,
      startAyah,
      endAyah,
      score,
    );
    return { id: markId };
  }

  @Get('getmarks')
  async getmarks() {
    return await this.studentservice.getmarks();
  }

  @Post('gettotalmark')
  async gettotalmarks(@Body('studentId') studentId: string) {
    const totalmarks = await this.studentservice.gettotalmarks(studentId);
    return totalmarks;
  }

  @Post('getdatemark')
  async gettodaymark(@Body('date') date: string) {
    return await this.studentservice.getdaymark(date);
  }

  
  @Get('getallstudents')
  async getallstudents() {
    const allstudents = await this.studentservice.getallstudents();
    return allstudents;
  }

  @Post('getallabscentdays')
  async getallabscentdays(@Body('studentId') studentId: string) {
    const abscentdays = await this.studentservice.getallabscentdays(studentId);
    return abscentdays;
  }

  @Get('gettakendays')
  async gettaken() {
    return await this.studentservice.gettaken();
  }

  @Get('getattendance')
  async getattendance() {
    return await this.studentservice.getattendance();
  }

  @Patch('deleteattendace')
  async deleteAte(@Body('day') day: string) {
    return await this.studentservice.delAss(day);
  }
  @Patch('editstudent')
  async editstudent(
    @Body('studentId') studentId: string,
    @Body('fullnName') fullName: string,
    @Body('studentAge') studentAge: number,
    @Body('musteweTeilim') musteweTeilim: string,
    @Body('sex') sex: string,
    @Body('subCity') subCity: string,
    @Body('wereda') wereda: string,
    @Body('kebele') kebele: string,
    @Body('specialNameOfArea') specialNameOfArea: string,
    @Body('homeNo') homeNo: number,
    @Body('familyNo') familyNo: number,
    @Body('MesderAdukhul') MesderAdukhul: string,
    @Body('ChooseParent') ChooseParent: string,
    @Body('chooseClass') chooseClass: string,    
  ) {
    const result = await this.studentservice.editstudent(
      studentId,
      fullName,
      studentAge,
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
    );
    return result;
  }

  @Patch('deletestudent')
  async deletestudent(@Body('studentId') studentId: string) {
    const result = await this.studentservice.deletestudent(studentId);
    return result;
  }

  @Patch('deletedate')
  async deletedate() {
    return await this.studentservice.deletedate();
  }

  @Get('deel')
  async deel() {
    await this.studentservice.deel();
    return 'done';
  }

  @Post('createsection')
  async createsection(
    @Body('sectionName') sectionName: string,
    @Body('dateCreated') dateCreated: string,
  ) {
    const result = await this.studentservice.createsection(
      sectionName,
      dateCreated,
    );
  }

  @Get('getallsections')
  async getsections() {
    const result = await this.studentservice.getallsections();
    return result;
  }

  @Post('getstudentsbysection')
  async getstudentsbysection(@Body('sectionName') sectionName: string) {
    let students = await this.studentservice.getstudentbysection(sectionName);
    return students;
  }

  @Patch('editclass')
  async editclass(
    @Body('classId') classId: string,
    @Body('className') className: string,
  ) {
    let editedSection = await this.studentservice.editsection(
      classId,
      className,
    );
    return editedSection;
  }

  @Patch('deleteclass')
  async deleteclass(@Body('classId') classId: string) {
    let result = await this.studentservice.deleteclass(classId);
    return result;
  }
}
