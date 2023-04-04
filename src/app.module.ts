import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { ChatModule } from './modules/chat/chat.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { UploadModule } from './modules/upload/upload.module';
import { UserModule } from './modules/user/user.module';
import { BcryptService } from './services/bcrypt.service';
import { ImageService } from './services/image.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [configuration],
    }),
    MongooseModule.forRoot('mongodb://localhost/talk-bird'),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    UserModule,
    PassportModule,
    ChatModule,
    UploadModule,
    GalleryModule,
  ],
  controllers: [AppController],
  providers: [AppService, BcryptService, JwtService, ImageService],
})
export class AppModule {}
