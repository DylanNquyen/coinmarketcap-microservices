// import { Controller, Post, Body } from '@nestjs/common';
// import { AiService } from './ai.service';

// @Controller('ai')
// export class AiController {
//   constructor(private readonly aiService: AiService) {}

//   @Post('chat') // POST /api/ai/chat
//   async chat(@Body() body: { prompt: string }) {
//     const reply = await this.aiService.askCopilot(body.prompt);
//     return { reply };
//   }
// }
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  async chat(@Body() body: { prompt: string }) {
    const reply = await this.aiService.askCopilot(body.prompt);
    return { reply };
  }
}
