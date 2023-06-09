/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/types';
@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config:ConfigService){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:'secret',
        });
    }
    validate(payload:JwtPayload){
        return payload;
    }
}
