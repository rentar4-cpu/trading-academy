import { Body, Controller, Get, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('sophia/status')
  status() {
    return this.aiService.getStatus();
  }

  @Post('sophia/chat')
  chat(@Body() body: { message?: string; context?: Record<string, unknown> }) {
    return this.aiService.chat(body);
  }

  @Get('sophia/system-instruction')
  systemInstruction() {
    return this.aiService.getSystemInstruction();
  }
}
