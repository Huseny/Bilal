import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AbscenceSchema } from './abscence.model';
import { MarkSchema } from './mark.model';
import { StudentController } from './student.controller';
import { SectionSchema, StudentSchema, TakenDays } from './student.model';
import { StudentService } from './student.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Student', schema: StudentSchema },
      { name: 'Abscent', schema: AbscenceSchema },
      { name: 'Mark', schema: MarkSchema },
      { name: 'Section', schema: SectionSchema },
      { name: 'TakenDays', schema: TakenDays },
    ]),
  ],
  providers: [StudentService],
  controllers: [StudentController],
})
export class StudentModule {}
