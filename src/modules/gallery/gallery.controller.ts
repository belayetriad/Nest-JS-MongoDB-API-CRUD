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

    file.filePath = fileName;
    Jimp.read(file?.path, (err, image) => {
      if (err) throw err;
      if (err) throw err;
      Jimp.read(
        `src/assets/watermark/${this.configService.get<string>(
          'waterMarkImageName',
        )}`,
        (err, watermark) => {
          if (err) throw err;
          watermark = watermark.resize(300, 300);
          // Get the dimensions of the base image and the overlay image
          const baseWidth = image.bitmap.width;
          const baseHeight = image.bitmap.height;
          const overlayWidth = watermark.bitmap.width;
          const overlayHeight = watermark.bitmap.height;

          // Calculate the x and y positions of the overlay image
          const x = baseWidth - overlayWidth;
          const y = baseHeight - overlayHeight;

          // Composite the overlay image onto the base image
          image.composite(
            watermark,
            x,
            y,
            {
              mode: Jimp.BLEND_SOURCE_OVER,
              opacityDest: 1,
              opacitySource: 0.5,
            },
            (err, image) => {
              if (err) throw err;

              // Save the composited image to a file
              image.write(fileName, (err) => {
                if (err) throw err;
                console.log('Image composited successfully!');
              });
            },
          );
        },
      );
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
