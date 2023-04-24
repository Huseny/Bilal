import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './Students/student.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://Abdulmelik619:jMV6RfKfzpJeVBdF@cluster0.457xzt4.mongodb.net/KuranTutorial?retryWrites=true&w=majority'),
    StudentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
