import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common/common.service';

@Injectable()
export class TestService {
    constructor(private readonly commonService: CommonService) {}

  testUUID(): string {
    return this.commonService.generateUUID();
  }
}
