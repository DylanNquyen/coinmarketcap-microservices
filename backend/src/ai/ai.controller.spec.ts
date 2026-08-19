import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

describe('AiController', () => {
  let controller: AiController;
  const askCopilot = jest.fn<AiService['askCopilot']>();

  beforeEach(async () => {
    askCopilot.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [
        {
          provide: AiService,
          useValue: {
            askCopilot,
          },
        },
      ],
    }).compile();

    controller = module.get<AiController>(AiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns the existing reply response contract', async () => {
    askCopilot.mockResolvedValue('Market summary');

    await expect(controller.chat({ prompt: 'Analyze BTC' })).resolves.toEqual({
      reply: 'Market summary',
    });
    expect(askCopilot).toHaveBeenCalledWith('Analyze BTC');
  });
});
