import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './Students/student.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards/at.guard';
import { SectionSchema, StudentSchema, TakenDays, UstazSchema } from './Students/student.model';
import { LoginSchema } from './auth/login.model';
import { AbscenceSchema } from './Students/abscence.model';
import { MarkSchema } from './Students/mark.model';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://Abdulmelik619:jMV6RfKfzpJeVBdF@cluster0.457xzt4.mongodb.net/KuranTutorial?retryWrites=true&w=majority'),
    
    StudentModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([
      {name: 'Ustaz', schema: UstazSchema},
      {name:"Login",schema:LoginSchema},
      { name: 'Student', schema: StudentSchema },
      { name: 'Abscent', schema: AbscenceSchema },
      { name: 'Mark', schema: MarkSchema },
      { name: 'Section', schema: SectionSchema },
      { name: 'TakenDays', schema: TakenDays },
    ])
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
