import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { TestModule } from './test/test.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './entities/todo.entity';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [CommonModule,  TodoModule,TestModule,
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root123',
    database: 'todos',
    entities: [TodoEntity],
    autoLoadEntities: true,
    synchronize: true, // Synchronize schema with database, use with caution in production
  }),
 
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
