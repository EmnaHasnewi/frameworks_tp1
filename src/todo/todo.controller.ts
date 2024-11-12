// src/todo/todo.controller.ts
import { Body, Controller, Post, Put, Param, Get, Patch, Delete, Query, BadRequestException } from '@nestjs/common';
import { CreateTodoDto } from '../dtos/create-todo.dto';
import { UpdateTodoDto } from '../dtos/update-todo.dto';
import { TodoService } from './todo.service';
import { TodoEntity } from 'src/entities/todo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from 'src/enums/status.enum';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  /*constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>
  ) {}*/

  @Get('test')
  testRoute() {
    return { message: 'Test route works' };
  }
  @Get('pagination')
  async getAll(
    @Query('page') page: number = 1,    // Paramètre page (par défaut 1)
    @Query('limit') limit: number = 10,  // Paramètre limit (par défaut 10)
    @Query('name') name?: string,        // Paramètre name (optionnel)
    @Query('description') description?: string, // Paramètre description (optionnel)
    @Query('status') status?: StatusEnum,   // Paramètre status (optionnel)
  ) {
    const result = await this.todoService.getAll(page, limit, name, description, status);
    return result;
  }
  @Get()
  async getTodos(
    @Query('name') name?: string,
    @Query('description') description?: string,
    @Query('status') status?: string,
  ) {
    let enumStatus: StatusEnum | undefined = undefined;
    if (status) {
      if (Object.values(StatusEnum).includes(status as StatusEnum)) {
        enumStatus = status as StatusEnum;
      } else {
        throw new BadRequestException(`Invalid status: ${status}`);
      }
    }

    return this.todoService.getTodos(name, description, enumStatus);
  }
  /*@Get()
  async getAllTodos(): Promise<TodoEntity[]> {
    return this.todoService.getAllTodos();
  }*/
  @Get(':id')
  async getTodoById(@Param('id') id: number): Promise<TodoEntity> {
    return this.todoService.getTodoById(id);
  }
  /*@Post()
  async addTodo(@Body() todoData: Partial<TodoEntity>): Promise<TodoEntity> {
    const todo = this.todoRepository.create(todoData); // Creates a new instance
    return await this.todoRepository.save(todo); // Saves it in the database
  }*/
  @Post()
  async createTodo(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

 /* @Put(':id')
  async updateTodo(
    @Param('id') id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todoService.update(id, updateTodoDto);
  }*/
    @Patch(':id')
    async updateTodo(
      @Param('id') id: number,
      @Body() updateData: Partial<TodoEntity>,
    ): Promise<TodoEntity> {
      return this.todoService.updateTodo(id, updateData);
    }
    @Delete(':id')
    async deleteTodo(@Param('id') id: number) {
      await this.todoService.deleteTodo(id);
      return { message: `Todo with ID ${id} has been deleted` };
    }
    @Patch(':id/restore')
  async restoreTodo(@Param('id') id: number) {
    await this.todoService.restoreTodo(id);
    return { message: `Todo with ID ${id} has been restored` };
  }
  @Get('status-count')
  async getTodosCountByStatus(): Promise<Record<StatusEnum, number>> {
    return this.todoService.countTodosByStatus();
  }
}
