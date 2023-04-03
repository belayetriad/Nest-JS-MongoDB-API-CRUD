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
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Jimp from 'jimp';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateGalleryDto } from 'src/dto/gallery.dto';
import { GalleryService } from './gallery.service';
@Controller('gallery')
export class GalleryController {
  constructor(
    private readonly galleryService: GalleryService,
    private readonly configService: ConfigService,
  ) {
    async function resize(img, heigth = 150, width = 150) {
      // Read the image.
      const image = await Jimp.read(img);
      // Resize the image to width 150 and heigth 150.
      await image.resize(heigth, width);
      // Save and overwrite the image
      await image.writeAsync(`test/${Date.now()}_150x150.png`);
    }
  }

  @Get()
  async getGalleries(): Promise<any> {
    return this.galleryService.getGalleries();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/original',
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
    const fileName = `uploads/${file?.filename}`;
    let watermark = await Jimp.read(
      `src/assets/watermark/${this.configService.get<string>(
        'waterMarkImageName',
      )}`,
    );
    watermark = watermark.resize(300, 300);
    file.filePath = fileName;
    Jimp.read(file?.path)
      .then((image) => {
        // Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then((font) => {
        //   const text = 'Sample Watermark';
        //   image.print(font, 100, 100, text);
        //   image.writeAsync(fileName);
        // });

        image.composite(watermark, 100, 100, {
          mode: Jimp.BLEND_SOURCE_OVER,
          opacityDest: 1,
          opacitySource: 0.5,
        });
        image.writeAsync(fileName);
      })
      .catch((err) => {
        // Handle an exception.
      });

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
