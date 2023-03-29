import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Jimp from 'jimp';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateGalleryDto } from 'src/dto/gallery.dto';
import { GalleryService } from './gallery.service';
@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  async getGalleries(): Promise<any> {
    return this.galleryService.getGalleries();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createGallery(
    @UploadedFile() file,
    @Body() createGalleryDto: CreateGalleryDto,
  ) {
    Jimp.read('uploads/1b3abfffe7c51c06834c948378862f71.png')
      .then((image) => {
        Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then((font) => {
          console.log(image);
          const text = 'Sample Watermark';
          image.print(font, 10, 10, text);
          image.writeAsync(`uploads/me1.jpg`);
        });
      })
      .catch((err) => {
        // Handle an exception.
      });
    // // const watermark = await Jimp.read('path/to/watermark');

    return this.galleryService.createGallery(createGalleryDto, file);
  }

  @Get(':id')
  async findOneGallery(@Param('id') id: string): Promise<any> {
    return this.galleryService.findOneGallery(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateGallery(
    @Param('id') id: string,
    @Body() createGalleryDto: CreateGalleryDto,
    @UploadedFile() file,
  ): Promise<any> {
    return this.galleryService.updateGallery(id, createGalleryDto, file);
  }

  @Delete(':id')
  async deleteGallery(@Param('id') id: string): Promise<any> {
    return this.galleryService.deleteGallery(id);
  }
}
