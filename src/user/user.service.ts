import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {User} from "./interface/user.interface"
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import { CreateUser } from './dto/CreateUser.dto';
import { LoginUser } from './dto/LoginUser.dto';
@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
     

    // createUser
    async createUser(createUser:CreateUser):Promise<{token:string}>{
        let {name,email,password}=createUser;
        let user=await this.userModel.findOne({email})
        if(user){
            throw new Error("User with this email already exists")
        }
        let salt=await bcrypt.genSalt(10)
        let hash =await bcrypt.hash(password,salt)
         user=await this.userModel.create({
            name,
            email,
            password:hash
        })

        let data={
            user:{
                id:user.id
            }
        }

        let JWT_SEC=`honeyisagoodboy`
        let token = jwt.sign(data,JWT_SEC)

        return {token}
    }
//   loginUser

    async loginUser(loginUser:LoginUser):Promise<{token:string}>{
        let {email,password}=loginUser;

        let user=await this.userModel.findOne({email})
         if(!user){
            throw new Error("Please authenticate using correct credentials")
         }

         let passwordCheck=await bcrypt.compare(password,user.password)

         if(!passwordCheck){
            throw new Error("Please authenticate using correct credentials")
         }

         let data={
            user:{
                id:user.id
            }
        }

        let JWT_SEC=`honeyisagoodboy`
        let token = jwt.sign(data,JWT_SEC)

        return {token}
        

    }
    
}
