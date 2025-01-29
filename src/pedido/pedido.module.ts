import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { ItemPedido } from 'src/item_pedido/entities/item_pedido.entity';
import { Produto } from 'src/produto/entities/produto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, ItemPedido, Produto])],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}
