import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemPedido } from './entities/item_pedido.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemPedido])],
})
export class ItemPedidoModule {}
