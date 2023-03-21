import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { unlinkSync } from 'fs';
import { Model } from 'mongoose';
import { CreateGalleryDto } from 'src/dto/gallery.dto';
import { Gallery } from 'src/schemas/gallery.schema';
@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Gallery.name) private readonly galleryModel: Model<Gallery>,
    private readonly configService: ConfigService,
  ) {}

  async getGalleries(): Promise<Gallery[]> {
    const galleries = await this.galleryModel.find().exec();
    return this.addFileUrls(galleries);
  }

  async findOneGallery(id: string): Promise<Gallery> {
    return this.galleryModel.findById(id).exec();
  }

  async createGallery(
    createGalleryDto: CreateGalleryDto,
    file,
  ): Promise<Gallery> {
    const gallery = new this.galleryModel(createGalleryDto);
    gallery.filePath = file.path;
    return gallery.save();
  }

  async updateGallery(
    id: string,
    createGalleryDto: CreateGalleryDto,
    file,
  ): Promise<Gallery> {
    const gallery = await this.galleryModel.findById(id).exec();

    if (!gallery) {
      throw new Error('Gallery not found');
    }

    if (file) {
      unlinkSync(gallery.filePath);
      gallery.filePath = file.path;
    }

    gallery.title = createGalleryDto.title;
    gallery.description = createGalleryDto.description;

    return gallery.save();
  }

  async deleteGallery(id: string): Promise<any> {
    const gallery = await this.galleryModel.findById(id).exec();

    if (!gallery) {
      throw new Error('Gallery not found');
    }

    unlinkSync(gallery.filePath);

    return this.galleryModel.deleteOne({ _id: id }).exec();
  }

  async addFileUrls(galleries: Gallery[]): Promise<Gallery[]> {
    const appUrl = this.configService.get<string>('APP_URL');
    return galleries.map((gallery) => {
      return {
        ...gallery['_doc'],
        fileUrl: `${appUrl}/${gallery.filePath}`,
      };
    });
  }
}
