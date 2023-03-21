import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = uuidv4();
          cb(null, `${filename}${file.originalname}`);
        },
      }),
    }),
  ],
  controllers: [UploadController],
})
export class UploadModule {}
