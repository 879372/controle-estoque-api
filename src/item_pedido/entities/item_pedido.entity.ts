import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Produto } from 'src/produto/entities/produto.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('item_pedido')
export class ItemPedido {
  @PrimaryGeneratedColumn()
  id_item_pedido: number;

  @ManyToOne(() => Pedido, pedido => pedido.itensPedido, {
    onDelete: 'CASCADE',
  })
  pedido: Pedido;

  @ManyToOne(() => Produto, produto => produto.itensPedido, {
    onDelete: 'CASCADE',
  })
  produto: Produto;

  @Column({ type: 'int' })
  quantidade: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco_unitario: number;
}
