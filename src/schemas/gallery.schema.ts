import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GalleryDocument = Gallery & Document;

@Schema()
export class Gallery {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  filePath: string;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
