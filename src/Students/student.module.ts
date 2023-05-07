import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AbscenceSchema } from './abscence.model';
import { MarkSchema } from './mark.model';
import { StudentController } from './student.controller';
import {
  SectionSchema,
  StudentSchema,
  TakenDays,
  UstazSchema,
} from './student.model';
import { StudentService } from './student.service';
import { ParentSchema } from 'src/models/Parent.model';
import { ClassSchema } from 'src/models/class.model';
import { EvaluationSchema } from 'src/models/evaluation.model';
import { LoginSchema } from 'src/auth/login.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Student', schema: StudentSchema },
      { name: 'Abscent', schema: AbscenceSchema },
      { name: 'Mark', schema: MarkSchema },
      { name: 'Section', schema: SectionSchema },
      { name: 'TakenDays', schema: TakenDays },
      { name: 'Parent', schema: ParentSchema },
      { name: 'Class', schema: ClassSchema },
      { name: 'Ustaz', schema: UstazSchema },
      { name: 'Evaluation', schema: EvaluationSchema },
      { name: 'Login', schema: LoginSchema },
    ]),
  ],
  providers: [StudentService],
  controllers: [StudentController],
})
export class StudentModule {}
