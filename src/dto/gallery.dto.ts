import { IsNotEmpty } from 'class-validator';

export class CreateGalleryDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}

export class GalleryDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  filePath: string;

  @IsNotEmpty()
  fileUrl: string;
}
