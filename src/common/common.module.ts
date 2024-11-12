import { Module } from '@nestjs/common';
import { CommonService } from './common/common.service';

@Module({
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {
  
}
