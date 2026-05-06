import { Module } from '@nestjs/common';
import { InventoryModule } from './inventory/inventory.module';
import { DiscountModule } from './discounts/discounts.module';
import { ReportsModule } from './reports/reports.module';
import { ManagersModule } from './managers/managers.module';
import { ProductsModule } from './products/products.module';
import { ClientDashboardModule } from './Dashboard/dashboard-client.module';
import { ClientVariantsModule } from './client-variant/client-variants.module';

@Module({
  imports: [
    InventoryModule,
    DiscountModule,
    ReportsModule,
    ManagersModule,
    ProductsModule,
    ClientDashboardModule,
    ClientVariantsModule,
  ],
})
export class ClientModule {}
