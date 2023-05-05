import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UstazSchema } from 'src/Students/student.model';
import { LoginSchema } from './login.model';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { AdminSchema } from 'src/models/admin.model';
import { ParentSchema } from 'src/models/Parent.model';

@Module({
  imports: [JwtModule.register({
    global: true,
    secret: 'secret',
    signOptions: { expiresIn: '60s' },
  }),MongooseModule.forFeature(
    [
      {name:"Ustaz", schema: UstazSchema},
      {name:"Login",schema:LoginSchema},
      {name: "Admin", schema: AdminSchema},
      {name: "Parent", schema: ParentSchema}
    ])],
  providers: [ AuthService,AtStrategy, RtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
