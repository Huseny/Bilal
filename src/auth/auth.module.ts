import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UstazSchema } from 'src/Students/student.model';
import { LoginSchema } from './login.model';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';

@Module({
  imports: [JwtModule.register({}),MongooseModule.forFeature(
    [
      {name:"Ustaz", schema: UstazSchema},
      {name:"Login",schema:LoginSchema},
    ])],
  providers: [ AuthService,AtStrategy, RtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
