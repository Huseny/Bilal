import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AbscenceSchema } from './abscence.model';
import { MarkSchema } from './mark.model';
import { StudentController } from './student.controller';
import { SectionSchema, StudentSchema, TakenDays } from './student.model';
import { StudentService } from './student.service';
import { ParentSchema } from 'src/models/Parent.model';
import { ClassSchema } from 'src/models/class.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Student', schema: StudentSchema },
      { name: 'Abscent', schema: AbscenceSchema },
      { name: 'Mark', schema: MarkSchema },
      { name: 'Section', schema: SectionSchema },
      { name: 'TakenDays', schema: TakenDays },
      { name: 'Parent', schema: ParentSchema},
      { name: 'Class', schema: ClassSchema}
    ]),
  ],
  providers: [StudentService],
  controllers: [StudentController],
})
export class StudentModule {}
