import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import {  Ustaz } from 'src/Students/student.model';
import * as bcrypt from "bcrypt";
import { Login } from './login.model';
import { UserRole } from 'src/common/roles/user.role';
import { tokens } from './types/types';
import { Admin } from 'src/models/admin.model';


@Injectable()
export class AuthService {
    constructor(@InjectModel("Login") private readonly loginModel:Model<Login>,
    @InjectModel("Ustaz") private readonly ustazModel:Model<Ustaz>,
    @InjectModel("Admin") private readonly adminModel:Model<Admin>,
    private jwtService:JwtService,
    private config:ConfigService){

    }
    hashData(data:string){
        return bcrypt.hash(data,10);
    }
    async getTokens(userId:string,name:string,role:string):Promise<tokens>{
        const [at,rt]=await Promise.all([
            this.jwtService.signAsync({
                sub:userId,
                name,
                role
            },{
                secret:this.config.get<string>("AT_SECRET"),
                expiresIn:60*15,
            }),
            this.jwtService.signAsync({
                sub:userId,
                name,
                role
            },{
                secret:this.config.get<string>("RT_SECRET"),
                expiresIn:60*60*24*7,
            })
        ])
        return {
            access_token:at,
            refresh_token:rt
        }
    }
    async updateRtHash(userId:string,rt:string){
        const hash =await this.hashData(rt);
        const doc=await this.loginModel.findByIdAndUpdate(userId,{hashedRt:hash});
        if (!doc) {
           throw new HttpException("A problem has occured",HttpStatus.BAD_REQUEST);
          } else {
            console.log('Updated document: ', doc);
          }
    }
    async signUpEmployer(name: string, password: string, phoneNo: number, email: string, address: string):Promise<any>{
        const hash=await this.hashData(password);
        const newUstazLogin=new this.loginModel({
            name: name,
            password:hash,
            role:UserRole.USTAZ
        })
        const newUstaz=new this.ustazModel({
            ustazName: name,
            password: hash,
            phoneNo,
            email,
            address,
        })
        await newUstazLogin.save();
        await newUstaz.save();
        const tokens=await this.getTokens(newUstazLogin.id,newUstazLogin.name,newUstazLogin.role)
        await this.updateRtHash(newUstazLogin.id,tokens.refresh_token)
        console.log(tokens);
        return {...tokens,role:newUstazLogin.role};

    }

    async addadmin(name: string, password: string,):Promise<any>{
        const hash=await this.hashData(password);
        const newadminlogin=new this.loginModel({
            name: name,
            password:hash,
            role:UserRole.ADMIN
        })
        const newAdmin=new this.adminModel({
            ustazName: name,
            password: hash,
            
        })
        await newadminlogin.save();
        await newAdmin.save();
        const tokens=await this.getTokens(newadminlogin.id,newadminlogin.name,newadminlogin.role)
        await this.updateRtHash(newadminlogin.id,tokens.refresh_token)
        console.log(tokens);
        return {...tokens,role:newadminlogin.role};

    }
    
    async login(name: string, password: string):Promise<any>{
        const user=await this.loginModel.findOne({name: name});
        console.log(user)
        if (!user) {
            //console.log('User not found');
            throw new HttpException("User not found!",HttpStatus.FORBIDDEN)
         } else {
            //console.log('Found user:', user);
            const passwordMatches=await bcrypt.compare(password,user.password);
            if(!passwordMatches) throw new HttpException("Password is not correct",HttpStatus.FORBIDDEN);
            const tokens=await this.getTokens(user.id,user.name,user.role);
            await this.updateRtHash(user.id,tokens.refresh_token)
            return {...tokens,role:user.role};
        }
    }
    async logout(userId: string) {
        const doc=await this.loginModel.findByIdAndUpdate(userId,{hashedRt:null});
        if (!doc) {
            throw new HttpException("A problem has occured",HttpStatus.BAD_REQUEST);
        } else {
            //console.log('Updated document: ', doc);
          }
        return true;
    }
    async refreshTokens(userId:string,rt:string){
        const user=await this.loginModel.findById({_id:userId});
        console.log(user.toJSON());
        if (!user) {
            throw new HttpException("A problem has occured",HttpStatus.BAD_REQUEST);
            //console.error(err);
          } else {
            //console.log(user);
            if(!user || !user.hashedRt) throw new HttpException("Access Denied!",HttpStatus.FORBIDDEN);
            const rtMatches=await bcrypt.compare(rt,user.hashedRt);
            console.log(rtMatches," ");
            if(!rtMatches){
                throw new HttpException("Access Denied!",HttpStatus.FORBIDDEN)
            }else{
                const tokens=await this.getTokens(user.id,user.name,user.role);
                await this.updateRtHash(user.id,tokens.refresh_token);
                return {...tokens,role:user.role};
            }
          }
    }
}
