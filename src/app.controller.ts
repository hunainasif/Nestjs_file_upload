import { Controller, Get, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express } from 'express';
import { promises as fs } from 'fs';
import { join } from 'path';
import * as pdf from "pdf-parse"
 
// Initialize OpenAI with your API key
 

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    console.log(file); // Log file details
    const filePath = join(__dirname, '..', 'uploads', file.filename);
    const buffer = await fs.readFile(filePath); // Read the file from disk

    let pdfFile=await pdf(buffer)
    console.log(pdfFile)
    console.log(buffer); // Log the buffer details
    return 'File uploaded and read successfully';
  }
}
