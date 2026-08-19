import { Injectable } from '@nestjs/common';
import { GoogleGenAI, type HttpOptions } from '@google/genai';
import { CryptoService } from '../crypto/crypto.service';

const GEMINI_HTTP_OPTIONS = {
  timeout: 12_000,
  retryOptions: {
    attempts: 3,
    initialDelay: 0.5,
    maxDelay: 2,
    expBase: 2,
    jitter: 1,
    httpStatusCodes: [429, 503],
  },
} satisfies HttpOptions;

interface AiMarketCoin {
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
}

function isAiMarketCoin(value: unknown): value is AiMarketCoin {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const coin = value as Record<string, unknown>;

  return (
    typeof coin.name === 'string' &&
    typeof coin.symbol === 'string' &&
    typeof coin.price === 'number' &&
    typeof coin.priceChange24h === 'number'
  );
}

function isAiMarketCoinList(value: unknown): value is AiMarketCoin[] {
  return Array.isArray(value) && value.every(isAiMarketCoin);
}

@Injectable()
export class AiService {
  private ai: GoogleGenAI;

  constructor(private readonly cryptoService: CryptoService) {
    const apiKey = process.env.GEMINI_API_KEY || 'GEMINI_API_KEY';
    this.ai = new GoogleGenAI({
      apiKey,
      httpOptions: GEMINI_HTTP_OPTIONS,
    });
  }

  async askCopilot(userPrompt: string): Promise<string> {
    try {
      // 1. Lấy dữ liệu top coin làm Context
      const marketData: unknown = await this.cryptoService.getTopCoins();

      if (!isAiMarketCoinList(marketData)) {
        throw new Error('Dữ liệu thị trường không hợp lệ.');
      }

      const topCoins = marketData;
      const coinSummary = topCoins
        .slice(0, 10) // Lấy top 10 coin cho phong phú
        .map(
          (c) =>
            `- ${c.name} (${c.symbol}): $${c.price} (Thay đổi 24h: ${c.priceChange24h}%)`,
        )
        .join('\n');

      // 2. System Instruction chuẩn chỉnh của bạn
      const systemInstruction = `
Bạn là AI Copilot phân tích thị trường Crypto.

Dữ liệu thị trường do hệ thống cung cấp:
${coinSummary}

Quy tắc:
- Chỉ sử dụng số liệu được cung cấp phía trên.
- Không tự đoán giá hoặc tạo số liệu mới.
- Nếu người dùng hỏi coin không có trong dữ liệu, hãy nói hệ thống chưa có dữ liệu hiện tại.
- Không cam kết lợi nhuận.
- Không khẳng định chắc chắn người dùng nên mua hoặc bán.
- Phân biệt rõ dữ liệu thực tế và nhận định.
- Trả lời bằng tiếng Việt, rõ ràng, tối đa 150 từ.
`;

      // 3. Gọi Gemini API với Config chuẩn
      const response = await this.ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction, // Đưa system instruction vào config
          temperature: 0.2, // Nhiệt độ thấp (0.2) giúp AI trả lời chính xác, bám sát dữ liệu, không sáng tạo lung tung
        },
      });

      return (
        response.text || 'Xin lỗi, AI chưa thể đưa ra câu trả lời lúc này.'
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Lỗi không xác định';
      console.error('Lỗi Gemini API:', errorMessage);
      return 'Đã xảy ra lỗi khi kết nối với AI Copilot. Vui lòng thử lại sau!';
    }
  }
}
