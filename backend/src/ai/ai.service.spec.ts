import { Test, type TestingModule } from '@nestjs/testing';
import { GoogleGenAI } from '@google/genai';
import { AiService } from './ai.service';
import { CryptoService } from '../crypto/crypto.service';

interface GenerateContentRequest {
  model: string;
  contents: string;
  config: {
    systemInstruction: string;
    temperature: number;
  };
}

interface GenerateContentResult {
  text?: string;
}

const EXPECTED_SYSTEM_INSTRUCTION = `
Bạn là AI Copilot phân tích thị trường Crypto.

Dữ liệu thị trường do hệ thống cung cấp:
- Bitcoin (BTC): $100000 (Thay đổi 24h: 1.5%)

Quy tắc:
- Chỉ sử dụng số liệu được cung cấp phía trên.
- Không tự đoán giá hoặc tạo số liệu mới.
- Nếu người dùng hỏi coin không có trong dữ liệu, hãy nói hệ thống chưa có dữ liệu hiện tại.
- Không cam kết lợi nhuận.
- Không khẳng định chắc chắn người dùng nên mua hoặc bán.
- Phân biệt rõ dữ liệu thực tế và nhận định.
- Trả lời bằng tiếng Việt, rõ ràng, tối đa 150 từ.
`;

const mockGenerateContent =
  jest.fn<
    (request: GenerateContentRequest) => Promise<GenerateContentResult>
  >();

jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: mockGenerateContent,
    },
  })),
}));

describe('AiService', () => {
  let service: AiService;
  const mockGetTopCoins = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
    mockGetTopCoins.mockResolvedValue([
      {
        name: 'Bitcoin',
        symbol: 'BTC',
        price: 100_000,
        priceChange24h: 1.5,
      },
    ]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: CryptoService,
          useValue: {
            getTopCoins: mockGetTopCoins,
          },
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('configures the Gemini client with bounded native retries', () => {
    expect(GoogleGenAI).toHaveBeenCalledWith({
      apiKey: 'GEMINI_API_KEY',
      httpOptions: {
        timeout: 12_000,
        retryOptions: {
          attempts: 3,
          initialDelay: 0.5,
          maxDelay: 2,
          expBase: 2,
          jitter: 1,
          httpStatusCodes: [429, 503],
        },
      },
    });
  });

  it('returns Gemini text without changing the generation request', async () => {
    mockGenerateContent.mockResolvedValue({ text: 'Market summary' });

    await expect(service.askCopilot('Analyze BTC')).resolves.toBe(
      'Market summary',
    );

    expect(mockGenerateContent).toHaveBeenCalledWith({
      model: 'gemini-flash-latest',
      contents: 'Analyze BTC',
      config: {
        systemInstruction: EXPECTED_SYSTEM_INSTRUCTION,
        temperature: 0.2,
      },
    });
  });

  it('returns the existing fallback after the SDK throws', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    mockGenerateContent.mockRejectedValue(
      new Error('503 UNAVAILABLE - high demand'),
    );

    await expect(service.askCopilot('Analyze BTC')).resolves.toBe(
      'Đã xảy ra lỗi khi kết nối với AI Copilot. Vui lòng thử lại sau!',
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Lỗi Gemini API:',
      '503 UNAVAILABLE - high demand',
    );
    consoleErrorSpy.mockRestore();
  });
});
