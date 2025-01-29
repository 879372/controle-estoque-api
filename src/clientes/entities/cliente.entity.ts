import { Pedido } from 'src/pedido/entities/pedido.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('cliente')
export class Cliente {
  @PrimaryGeneratedColumn()
  id_cliente: number;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  telefone: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  endereco: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  bairro: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  cidade: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  estado: string;

  @Column({ type: 'varchar', length: 9, nullable: true })
  cep: string;

  @CreateDateColumn()
  data_cadastro: Date;

  @OneToMany(() => Pedido, pedido => pedido.cliente)
  pedidos: Pedido[];
}
