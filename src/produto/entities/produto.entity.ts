import { ItemPedido } from 'src/item_pedido/entities/item_pedido.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('produto')
export class Produto {
  @PrimaryGeneratedColumn()
  id_produto: number;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco: number;

  @Column({ type: 'int', default: 0 })
  estoque: number;

  @CreateDateColumn()
  data_cadastro: Date;

  @Column({ type: 'date' })
  data_validade: Date;

  @OneToMany(() => ItemPedido, itemPedido => itemPedido.produto)
  itensPedido: ItemPedido[];
}
