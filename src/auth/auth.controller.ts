import { Controller, Post, HttpCode, HttpStatus, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { RtGuard } from 'src/common/guards/rt.guard';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){

    }

    @Public()
    @Post("signup/ustaz")
    @HttpCode(HttpStatus.CREATED)
    async signUpEmployer(
      @Body('name') name: string,
      @Body('password') password: string
      ){
       const result=await this.authService.signUpEmployer(name, password);
       return  result as object;
    }

    

    @Public()
    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(
      @Body('name') name: string,
      @Body('password') password: string
      ){
        const result=await this.authService.login(name, password)
        return result as object;
    }


    @Post("logout")
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUserId() userId:string){
        return this.authService.logout(userId);
    }

    @Public()
    @UseGuards(RtGuard)
    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    async refreshTokens(
        @GetCurrentUserId() userId:string,
        @GetCurrentUser("refreshToken") refreshToken:string,
    ){
        //console.log(refreshToken);
        const result=await this.authService.refreshTokens(userId,refreshToken);
        return result as object;
    }
}