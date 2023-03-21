import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { GallerySchema } from 'src/schemas/gallery.schema';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Gallery', schema: GallerySchema }]),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
