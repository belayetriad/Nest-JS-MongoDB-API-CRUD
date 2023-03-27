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
  originalName: string;

  @Prop()
  mimeType: string;

  @Prop()
  fileName: string;

  @Prop()
  size: number;

  @Prop()
  filePath: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
