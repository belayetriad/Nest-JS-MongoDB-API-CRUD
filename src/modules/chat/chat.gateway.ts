import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Server } from 'http';
import { CreateChatDto, UpdateChatDto } from 'src/dto/chat.dto';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  async handleConnection() {
    console.log('A client has connected');
    const chats = await this.chatService.findAll();
    this.server.emit('chats', chats);
  }

  async handleDisconnect() {
    console.log('A client has disconnected');
  }

  @SubscribeMessage('createChat')
  async createChat(client: Socket, createChatDto: CreateChatDto) {
    const chat = await this.chatService.create(createChatDto);
    client.emit('chatCreated', chat);
  }

  @SubscribeMessage('getChats')
  async getChats(client: Socket) {
    const chats = await this.chatService.findAll();
    client.emit('chats', chats);
  }

  @SubscribeMessage('deleteChat')
  async deleteChat(client: Socket, id: string) {
    const chat = await this.chatService.remove(id);
    client.emit('chatDeleted', chat);
  }

  @SubscribeMessage('updateChat')
  async updateChat(
    client: Socket,
    { id, updateChatDto }: { id: string; updateChatDto: UpdateChatDto },
  ) {
    const chat = await this.chatService.update(id, updateChatDto);
    client.emit('chatUpdated', chat);
  }
}
