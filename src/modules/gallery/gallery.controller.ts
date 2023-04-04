import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as Jimp from 'jimp';
import * as mkdirp from 'mkdirp';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateGalleryDto } from 'src/dto/gallery.dto';
import { ImageService } from 'src/services/image.service';
import { GalleryService } from './gallery.service';

@Controller('gallery')
export class GalleryController {
  constructor(
    private readonly galleryService: GalleryService,
    private readonly configService: ConfigService,
    private readonly imageService: ImageService,
  ) {}

  @Get()
  async getGalleries(): Promise<any> {
    return this.galleryService.getGalleries();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const now = new Date();
          const year = now.getFullYear().toString();
          const month = (now.getMonth() + 1).toString().padStart(2, '0');
          const day = now.getDate().toString().padStart(2, '0');
          const directory = `./src/uploads/${year}/${month}/${day}`;
          await mkdirp(directory);
          cb(null, directory);
        },
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
    console.log(file);

    file.filePath = `${file?.destination}/${file?.filename}`;

    return this.galleryService.createGallery(createGalleryDto, file);
  }

  @Get(':id')
  async findOneGallery(@Param('id') id: string): Promise<any> {
    return this.galleryService.findOneGallery(id);
  }

  @Get('public/:fileName')
  async getImage(
    @Param('fileName') fileName: string,
    @Query('width') width: number,
    @Query('height') height: number,
    @Query('quality') quality: number,
    @Res() res: Response,
  ) {
    try {
      const image = await Jimp.read(`src/uploads/${fileName}`);

      const watermark = await Jimp.read(
        `src/assets/watermark/${this.configService.get<string>(
          'waterMarkImageName',
        )}`,
      );

      if (width && !height) {
        image.resize(
          Number(width),
          this.imageService.getImageHeightByOriginalRatio(
            image.getHeight(),
            image.getWidth(),
            width,
          ),
        );
      } else if (!width && height) {
        image.resize(
          this.imageService.getImageWidthByOriginalRatio(
            image.getHeight(),
            image.getWidth(),
            height,
          ),
          Number(height),
        );
      } else if (width && height) {
        image.resize(
          Number(
            this.imageService.getImageHeightWidthByOriginalRatio(
              image.getHeight(),
              image.getWidth(),
              height,
              width,
            ).width,
          ),
          Number(
            this.imageService.getImageHeightWidthByOriginalRatio(
              image.getHeight(),
              image.getWidth(),
              height,
              width,
            ).height,
          ),
        );
      }

      // Resize the overlay image to match the background image size
      // watermark.resize(image.bitmap.width, image.bitmap.height);
      watermark.resize(300, 300);

      const baseWidth = image.bitmap.width;
      const baseHeight = image.bitmap.height;
      const overlayWidth = watermark.bitmap.width;
      const overlayHeight = watermark.bitmap.height;

      // Calculate the x and y positions of the overlay image
      const x = baseWidth - overlayWidth;
      const y = baseHeight - overlayHeight;

      // Composite the overlay image on top of the background image
      image.composite(watermark, x, y, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacityDest: 1,
        opacitySource: 0.5,
      });

      // Get the resulting image as a buffer with the PNG MIME type
      const buffer = await image.getBufferAsync(Jimp.MIME_PNG);

      return res.type(image.getMIME()).send(buffer);
    } catch (err) {
      console.error(err);
    }
  }

  @Get('source/:fileName')
  async getSourceImage(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    const image = await Jimp.read(`src/uploads/${fileName}`);

    try {
      const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
      res.type(Jimp.MIME_JPEG).send(buffer);
    } catch (err) {
      // Handle image not found errors
      res.status(404).send('Image not found');
    }
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
