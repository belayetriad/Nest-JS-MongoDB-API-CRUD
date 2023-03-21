import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChatDto, UpdateChatDto } from 'src/dto/chat.dto';
import { Chat } from 'src/schemas/chat.schema';
@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    const createdChat = new this.chatModel(createChatDto);
    return createdChat.save();
  }

  async findAll(): Promise<Chat[]> {
    return this.chatModel.find().exec();
  }

  async findOne(id: string): Promise<Chat> {
    return this.chatModel.findById(id).exec();
  }

  async update(id: string, updateChatDto: UpdateChatDto): Promise<Chat> {
    return this.chatModel.findByIdAndUpdate(id, updateChatDto, { new: true });
  }

  async remove(id: string): Promise<void> {
    await this.chatModel.findByIdAndDelete(id);
  }
}
