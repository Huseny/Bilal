import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Ustaz } from 'src/Students/student.model';
import * as bcrypt from 'bcrypt';
import { Login } from './login.model';
import { UserRole } from 'src/common/roles/user.role';
import { tokens } from './types/types';
import { Admin } from 'src/models/admin.model';
import { Parent } from 'src/models/Parent.model';
const nodemailer = require('nodemailer');

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Login') private readonly loginModel: Model<Login>,
    @InjectModel('Ustaz') private readonly ustazModel: Model<Ustaz>,
    @InjectModel('Admin') private readonly adminModel: Model<Admin>,
    @InjectModel('Parent') private parent: Model<Parent>,

    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
  async getTokens(userId: string, name: string, role: string): Promise<tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          name,
          role,
        },
        {
          secret: this.config.get<string>('AT_SECRET'),
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          name,
          role,
        },
        {
          secret: this.config.get<string>('RT_SECRET'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    const doc = await this.loginModel.findByIdAndUpdate(userId, {
      hashedRt: hash,
    });
    if (!doc) {
      throw new HttpException('A problem has occured', HttpStatus.BAD_REQUEST);
    }
  }
  async signUpEmployer(
    username: string,
    password: string,
    name: string,
    phoneNo: number,
    email: string,
    address: string,
  ): Promise<any> {
    try {
      const hash = await this.hashData(password);
      const newUstaz = new this.ustazModel({
        ustazName: name,
        password: hash,
        phoneNo,
        email,
        address,
      });
      const newUstazId = await newUstaz.save();
      const newUstazLogin = new this.loginModel({
        name: username,
        password: hash,
        role: UserRole.USTAZ,
        userId: newUstazId._id,
      });

      await newUstazLogin.save();
      this.sendmail(email, username, password);
      return newUstazId;
    } catch (err) {
      return new HttpException(
        'a problem has occured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addadmin(name: string, password: string): Promise<any> {
    try {
      const hash = await this.hashData(password);
      const newadminlogin = new this.loginModel({
        name: name,
        password: hash,
        role: UserRole.ADMIN,
      });
      const newAdmin = new this.adminModel({
        ustazName: name,
        password: hash,
      });
      await newadminlogin.save();
      await newAdmin.save();
      const tokens = await this.getTokens(
        newadminlogin.id,
        newadminlogin.name,
        newadminlogin.role,
      );
      await this.updateRtHash(newadminlogin.id, tokens.refresh_token);
      return { ...tokens, role: newadminlogin.role };
    } catch (err) {
      return new HttpException(
        'a problem has occured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async addparent(
    username: string,
    password: string,
    fullName: string,
    sex: string,
    phoneNo: string,
    email: string,
    address: string,
  ) {
    try {
      const hash = await this.hashData(password);
      const newParent = new this.parent({
        fullName,
        password,
        sex,
        phoneNo,
        email,
        address,
      });
      const parentId = await newParent.save();
      const newParentLogin = new this.loginModel({
        name: username,
        password: hash,
        role: UserRole.PARENT,
        userId: parentId._id,
      });

      await newParentLogin.save();
      this.sendmail(email, username, password);
      return parentId;
    } catch (err) {
      return new HttpException(
        'a problem has occured',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(name: string, password: string): Promise<any> {
    const user = await this.loginModel.findOne({ name: name });
    if (!user) {
      throw new HttpException('User not found!', HttpStatus.FORBIDDEN);
    } else {
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches)
        throw new HttpException(
          'Password is not correct',
          HttpStatus.FORBIDDEN,
        );
      const tokens = await this.getTokens(user.id, user.name, user.role);
      await this.updateRtHash(user.id, tokens.refresh_token);
      return { ...tokens, role: user.role };
    }
  }
  async logout(userId: string) {
    const doc = await this.loginModel.findByIdAndUpdate(userId, {
      hashedRt: null,
    });
    if (!doc) {
      throw new HttpException('A problem has occured', HttpStatus.BAD_REQUEST);
    }
    return true;
  }
  async refreshTokens(userId: string, rt: string) {
    const user = await this.loginModel.findById({ _id: userId });
    if (!user) {
      throw new HttpException('A problem has occured', HttpStatus.BAD_REQUEST);
    } else {
      if (!user || !user.hashedRt)
        throw new HttpException('Access Denied!', HttpStatus.FORBIDDEN);
      const rtMatches = await bcrypt.compare(rt, user.hashedRt);
      if (!rtMatches) {
        throw new HttpException('Access Denied!', HttpStatus.FORBIDDEN);
      } else {
        const tokens = await this.getTokens(user.id, user.name, user.role);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return { ...tokens, role: user.role };
      }
    }
  }

  async getUserInformation(userId: string) {
    const user = await this.loginModel.findById({ _id: userId });
    if (!user) {
      throw new HttpException('A problem has occured', HttpStatus.BAD_REQUEST);
    }
    return user;
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

    transporter.sendMail(mailOptions);
  }
}
