import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class AiService {
  private ai: GoogleGenAI;

  constructor(private readonly cryptoService: CryptoService) {
    const apiKey = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE';
    this.ai = new GoogleGenAI({ apiKey });
  }

  async askCopilot(userPrompt: string): Promise<string> {
    try {
      // 1. Lấy dữ liệu top coin làm Context
      const topCoins = await this.cryptoService.getTopCoins();
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

Chỉ sử dụng dữ liệu giá trong phần dữ liệu thị trường trên.
Nếu người dùng hỏi một đồng coin không có trong dữ liệu, hãy nói rằng hệ thống chưa có dữ liệu hiện tại của đồng coin đó.
Không được tự đoán giá.

Không đưa ra cam kết lợi nhuận hoặc khẳng định chắc chắn nên mua/bán.
Trả lời bằng tiếng Việt, ngắn gọn, dưới 150 từ.
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

      return response.text || 'Xin lỗi, AI chưa thể đưa ra câu trả lời lúc này.';
    } catch (error: any) {
      console.error('Lỗi Gemini API:', error.message);
      return 'Đã xảy ra lỗi khi kết nối với AI Copilot. Vui lòng thử lại sau!';
    }
  }
}