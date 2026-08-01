import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SOPHIA_SYSTEM_INSTRUCTION } from './sophia.constants';

type SophiaChatDto = {
  message?: string;
  context?: Record<string, unknown>;
  conversation?: Array<{
    role?: string;
    content?: string;
  }>;
  player_id?: number;
};

@Injectable()
export class AiService {
  private readonly requestLog = new Map<string, number[]>();
  private activeRequests = 0;

  constructor(private readonly configService: ConfigService) {}

  async getStatus() {
    const provider = this.providerName();
    const enabled = this.isSophiaEnabled();
    const providerAvailable =
      enabled && provider === 'ollama'
        ? await this.isOllamaAvailable()
        : enabled;

    return {
      assistant: 'Sophia',
      enabled,
      provider,
      model: this.modelName(),
      available: providerAvailable,
      mode:
        provider === 'mock'
          ? 'mock'
          : providerAvailable
            ? 'provider-ready'
            : 'fallback',
      system_instruction_version: this.promptVersion(),
    };
  }

  async chat(dto: SophiaChatDto) {
    if (!this.isSophiaEnabled()) {
      return this.unavailableResponse();
    }

    const message = this.cleanMessage(dto.message);
    const clientKey = this.clientKey(dto);
    if (!this.allowRequest(clientKey)) {
      return {
        assistant: 'Sophia',
        provider: this.providerName(),
        model: this.modelName(),
        available: false,
        message:
          'Sophia has reached the current public-alpha usage limit. Please try again later.',
        safety: this.safetyNote(),
      };
    }

    if (this.activeRequests >= this.maxConcurrentRequests()) {
      return this.unavailableResponse();
    }

    if (this.providerName() === 'ollama') {
      this.activeRequests += 1;
      try {
        return await this.chatWithOllama(message, dto);
      } catch {
        return this.unavailableResponse();
      } finally {
        this.activeRequests = Math.max(0, this.activeRequests - 1);
      }
    }

    return {
      assistant: 'Sophia',
      provider: this.providerName(),
      model: this.modelName(),
      available: true,
      message: this.mockEducationalResponse(message, dto.context),
      safety: this.safetyNote(),
    };
  }

  getSystemInstruction() {
    return {
      assistant: 'Sophia',
      version: this.promptVersion(),
      note: 'System instructions are stored server-side and are not exposed publicly.',
    };
  }

  private isSophiaEnabled() {
    return (
      this.configService.get<string>(
        'SOPHIA_AI_ENABLED',
        this.configService.get<string>('SOPHIA_ENABLED', 'true'),
      ) !== 'false'
    );
  }

  private providerName() {
    return this.configService.get<string>(
      'SOPHIA_AI_PROVIDER',
      this.configService.get<string>('SOPHIA_PROVIDER', 'mock'),
    );
  }

  private modelName() {
    return this.configService.get<string>('SOPHIA_AI_MODEL', 'qwen3:4b');
  }

  private ollamaBaseUrl() {
    return this.configService
      .get<string>('OLLAMA_BASE_URL', 'http://127.0.0.1:11434')
      .replace(/\/+$/, '');
  }

  private promptVersion() {
    return this.configService.get<string>('SOPHIA_PROMPT_VERSION', '1.0');
  }

  private requestTimeoutMs() {
    return Number(
      this.configService.get<string>('SOPHIA_REQUEST_TIMEOUT_MS', '60000'),
    );
  }

  private maxOutputTokens() {
    return Number(
      this.configService.get<string>('SOPHIA_MAX_OUTPUT_TOKENS', '600'),
    );
  }

  private recentMessageLimit() {
    return Number(
      this.configService.get<string>('SOPHIA_RECENT_MESSAGE_LIMIT', '10'),
    );
  }

  private rateLimitPerHour() {
    return Number(
      this.configService.get<string>('SOPHIA_RATE_LIMIT_PER_HOUR', '20'),
    );
  }

  private maxConcurrentRequests() {
    return Number(
      this.configService.get<string>('SOPHIA_MAX_CONCURRENT_REQUESTS', '2'),
    );
  }

  private maxInputCharacters() {
    return Number(
      this.configService.get<string>('SOPHIA_MAX_INPUT_CHARACTERS', '4000'),
    );
  }

  private cleanMessage(message?: string) {
    return String(message || '')
      .trim()
      .slice(0, this.maxInputCharacters());
  }

  private clientKey(dto: SophiaChatDto) {
    return dto.player_id ? `player:${dto.player_id}` : 'anonymous';
  }

  private allowRequest(clientKey: string) {
    const now = Date.now();
    const windowStart = now - 60 * 60 * 1000;
    const existing = (this.requestLog.get(clientKey) || []).filter(
      (timestamp) => timestamp > windowStart,
    );
    if (existing.length >= this.rateLimitPerHour()) {
      this.requestLog.set(clientKey, existing);
      return false;
    }

    existing.push(now);
    this.requestLog.set(clientKey, existing);
    return true;
  }

  private async isOllamaAvailable() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    try {
      const response = await fetch(`${this.ollamaBaseUrl()}/api/tags`, {
        signal: controller.signal,
      });
      return response.ok;
    } catch {
      return false;
    } finally {
      clearTimeout(timeout);
    }
  }

  private async chatWithOllama(message: string, dto: SophiaChatDto) {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      this.requestTimeoutMs(),
    );
    try {
      const response = await fetch(`${this.ollamaBaseUrl()}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.modelName(),
          stream: false,
          think: false,
          options: {
            num_predict: this.maxOutputTokens(),
            temperature: 0.35,
          },
          messages: this.buildOllamaMessages(message, dto),
        }),
      });

      if (!response.ok) {
        throw new Error('Ollama request failed');
      }

      const payload = (await response.json()) as {
        message?: { content?: string };
        response?: string;
      };
      const content = this.cleanModelOutput(
        String(payload.message?.content || payload.response || ''),
      );

      return {
        assistant: 'Sophia',
        provider: 'ollama',
        model: this.modelName(),
        available: true,
        message: this.isUsableFinalAnswer(content)
          ? content
          : this.mockEducationalResponse(message, dto.context),
        safety: this.safetyNote(),
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  private buildOllamaMessages(message: string, dto: SophiaChatDto) {
    const recentConversation = (dto.conversation || [])
      .filter(
        (item) =>
          item?.content && ['user', 'assistant'].includes(String(item.role)),
      )
      .slice(-this.recentMessageLimit())
      .map((item) => ({
        role: item.role === 'assistant' ? 'assistant' : 'user',
        content: String(item.content).slice(0, 1200),
      }));

    return [
      {
        role: 'system',
        content: `${SOPHIA_SYSTEM_INSTRUCTION}\n\nGame context:\n${this.safeContext(dto.context)}`,
      },
      ...recentConversation,
      {
        role: 'user',
        content:
          message ||
          'Explain one useful learning principle from my current Mentavio session.',
      },
    ];
  }

  private safeContext(context?: Record<string, unknown>) {
    const allowedKeys = [
      'language',
      'page',
      'selected_symbol',
      'selected_company',
      'cash_balance',
      'net_worth',
      'positions_count',
      'last_trade',
      'latest_event',
      'price_change_percent',
      'buy_pressure_percent',
    ];
    const safe: Record<string, unknown> = {};
    for (const key of allowedKeys) {
      if (context && key in context) safe[key] = context[key];
    }
    return JSON.stringify(safe).slice(0, 2000);
  }

  private unavailableResponse() {
    return {
      assistant: 'Sophia',
      provider: this.providerName(),
      model: this.modelName(),
      available: false,
      message:
        'Sophia is temporarily unavailable. You can continue using the Mentavio simulation and try again later.',
      safety: this.safetyNote(),
    };
  }

  private cleanModelOutput(content: string) {
    const trimmed = content.trim();
    const closingThinkTag = '</think>';
    const closingIndex = trimmed.lastIndexOf(closingThinkTag);
    const withoutThinking =
      closingIndex >= 0
        ? trimmed.slice(closingIndex + closingThinkTag.length)
        : trimmed.replace(/<think>[\s\S]*?<\/think>/gi, '');

    return withoutThinking
      .replace(/<think>/gi, '')
      .replace(/<\/think>/gi, '')
      .trim()
      .slice(0, 1800);
  }

  private safetyNote() {
    return 'Sophia provides general educational explanations about the Mentavio simulation. Sophia does not provide personalised financial advice.';
  }

  private isUsableFinalAnswer(content: string) {
    if (content.length < 40) return false;
    const lower = content.toLowerCase();
    return ![
      'okay, the user',
      'the user is asking',
      'i need to',
      'i should',
      'game context provided',
      'structure the answer',
      'key points to cover',
    ].some((pattern) => lower.includes(pattern));
  }

  private mockEducationalResponse(
    message: string,
    context?: Record<string, unknown>,
  ) {
    const cleanMessage = message.trim();
    if (!cleanMessage) {
      return 'Ask me about a simulated trade, a market term, or a Mentavio event, and I will explain the learning principle.';
    }

    const mentionsPriceMove = /why|price|went|up|down|rose|fell|grew|drop/i.test(
      cleanMessage,
    );
    if (mentionsPriceMove) {
      const selectedCompany =
        context &&
        typeof context.selected_company === 'object' &&
        context.selected_company
          ? (context.selected_company as Record<string, unknown>)
          : undefined;
      const symbol = String(
        context?.selected_symbol || selectedCompany?.symbol || 'the company',
      );
      const sector = selectedCompany?.sector
        ? ` in the ${String(selectedCompany.sector)} sector`
        : '';
      const change = context?.price_change_percent
        ? ` The visible move is about ${String(context.price_change_percent)}%.`
        : '';
      const buyPressure = context?.buy_pressure_percent
        ? ` Buy pressure is ${String(context.buy_pressure_percent)}%, which means the simulation is showing more buying interest than selling pressure.`
        : '';

      return `In Mentavio, ${symbol}${sector} most likely went up because the simulation detected stronger demand than supply.${buyPressure}${change} The learning point is simple: when many simulated traders buy the same asset, the game can push the fictional price higher, but that does not guarantee the move will continue.`;
    }

    return `In Mentavio, this should be treated as a simulated learning situation. Start by identifying the asset, the event, the risk, and the reason for the decision. In real markets, similar events may influence prices, but the reaction can vary depending on many factors.`;
  }
}
