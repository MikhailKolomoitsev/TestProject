import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { CustomerModuleBase } from '../customer/base/customer.module.base';
import { SaleModuleBase } from './base/sale.module.base';

@Module({
  imports: [SaleModuleBase],
  providers: [SaleService],
  controllers: [SaleController],
  exports: [SaleService]
})
export class SaleModule {}
