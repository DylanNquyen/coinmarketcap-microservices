import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // <-- Thêm dòng này
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';

@Module({
  imports: [HttpModule], // <-- Đưa HttpModule vào đây
  controllers: [CryptoController],
  providers: [CryptoService],
})
export class CryptoModule {}