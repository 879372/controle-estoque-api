import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { ItemPedido } from 'src/item_pedido/entities/item_pedido.entity';
import { Produto } from 'src/produto/entities/produto.entity';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { ClientesModule } from 'src/clientes/clientes.module';
import { ProdutoModule } from 'src/produto/produto.module';
import { PedidoModule } from 'src/pedido/pedido.module';
import { ItemPedidoModule } from 'src/item_pedido/item_pedido.module';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '123456',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Cliente, Produto, Pedido, ItemPedido, Usuario]),
    ClientesModule,
    ProdutoModule,
    PedidoModule,
    ItemPedidoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
