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
import { UsuarioModule } from 'src/usuario/usuario.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'richly-priceless-humpback.data-1.use1.tembo.io',
      port: 5432,
      username: 'postgres',
      password: 'Umr2TSNhP2T7UkTl',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
      extra:{
        ssl:{
          rejectUnauthorized: false,
        }
      }
    }),
    TypeOrmModule.forFeature([Cliente, Produto, Pedido, ItemPedido, Usuario]),
    ClientesModule,
    ProdutoModule,
    PedidoModule,
    ItemPedidoModule,
    UsuarioModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
