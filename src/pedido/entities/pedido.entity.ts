import { Cliente } from 'src/clientes/entities/cliente.entity';
import { ItemPedido } from 'src/item_pedido/entities/item_pedido.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('pedido')
export class Pedido {
  @PrimaryGeneratedColumn()
  id_pedido: number;

  @ManyToOne(() => Cliente, cliente => cliente.pedidos, {
    onDelete: 'CASCADE',
  })
  cliente: Cliente;

  @CreateDateColumn()
  data_pedido: Date;

  @Column({
    type: 'enum',
    enum: ['PENDENTE', 'APROVADO', 'ENVIADO', 'CANCELADO'],
    default: 'PENDENTE',
  })
  status: 'PENDENTE' | 'APROVADO' | 'ENVIADO' | 'CANCELADO';

  @OneToMany(() => ItemPedido, itemPedido => itemPedido.pedido)
  itensPedido: ItemPedido[];

  @Column({ type: 'int', default: 0 })
  quantidade_total: number; // Armazena a soma das quantidades dos itens do pedido

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  valor_total: number; // Armazena a soma do valor total dos itens do pedido
}
