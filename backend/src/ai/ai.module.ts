import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CryptoModule } from '../crypto/crypto.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [ConfigModule, CryptoModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
