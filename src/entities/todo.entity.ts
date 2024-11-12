import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { StatusEnum } from '../enums/status.enum';
import { BaseEntity } from './BaseEntity';

@Entity('todo')
export class TodoEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column('text')
  description: string;

  
  //createdAt will be set automatically when the entity is first created, 
  //and it won’t change on future updates. This behavior makes it effectively immutable after the initial save.
  @Column({
    type: 'enum',
    enum: StatusEnum,
  })
  status: StatusEnum;

}
