import { Body, Controller,Get, Post } from '@nestjs/common';
import { CreateUser } from './dto/CreateUser.dto';
import { UserService } from './user.service';
import { LoginUser } from './dto/LoginUser.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}
    @Post('register')
    async createUser(@Body() createUser:CreateUser):Promise<{token:string}>{
        return this.userService.createUser(createUser)
    }    
    @Post('login')
    async loginUser(@Body() loginUser:LoginUser):Promise<{token:string}>{
        return this.userService.loginUser(loginUser)
    }
}
