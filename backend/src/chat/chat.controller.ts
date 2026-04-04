import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('ask')
  async ask(@Body() body: { message: string; history: any[] }, @Req() req: any) {
    return { response: await this.chatService.getChatResponse(body.message, body.history, req) };
  }
}
