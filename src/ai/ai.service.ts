import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SOPHIA_SYSTEM_INSTRUCTION } from './sophia.constants';

type SophiaChatDto = {
  message?: string;
  context?: Record<string, unknown>;
};

@Injectable()
export class AiService {
  constructor(private readonly configService: ConfigService) {}

  getStatus() {
    return {
      assistant: 'Sophia',
      enabled: this.isSophiaEnabled(),
      provider: this.providerName(),
      mode: this.providerName() === 'mock' ? 'mock' : 'provider-ready',
      system_instruction_version: '2026-07-31-mvp',
    };
  }

  async chat(dto: SophiaChatDto) {
    if (!this.isSophiaEnabled()) {
      throw new ServiceUnavailableException(
        'Sophia is temporarily unavailable. The simulation continues normally.',
      );
    }

    return {
      assistant: 'Sophia',
      provider: this.providerName(),
      message: this.mockEducationalResponse(dto.message || ''),
      safety:
        'Educational simulation only. Sophia does not provide personalised financial advice.',
    };
  }

  getSystemInstruction() {
    return {
      assistant: 'Sophia',
      version: '2026-07-31-mvp',
      instruction: SOPHIA_SYSTEM_INSTRUCTION,
    };
  }

  private isSophiaEnabled() {
    return this.configService.get<string>('SOPHIA_ENABLED', 'true') !== 'false';
  }

  private providerName() {
    return this.configService.get<string>('SOPHIA_PROVIDER', 'mock');
  }

  private mockEducationalResponse(message: string) {
    const cleanMessage = message.trim();
    if (!cleanMessage) {
      return 'Ask me about a simulated trade, a market term, or a Mentario event, and I will explain the learning principle.';
    }

    return `In Mentario, this should be treated as a simulated learning situation. Start by identifying the asset, the event, the risk, and the reason for the decision. In real markets, similar events may influence prices, but the reaction can vary depending on many factors.`;
  }
}
