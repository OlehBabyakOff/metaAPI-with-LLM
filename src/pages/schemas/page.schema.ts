import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'pages' })
export class Page extends Document {
  @Prop({ required: true, unique: true, index: true })
  pageId!: string;

  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop()
  generatedDescription?: string;

  @Prop()
  category?: string;

  @Prop()
  pageAccessToken?: string;
}

export const PageSchema = SchemaFactory.createForClass(Page);
