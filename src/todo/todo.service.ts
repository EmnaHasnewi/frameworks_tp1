// src/todo/todo.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { TodoEntity } from '../entities/todo.entity';
import { CreateTodoDto } from '../dtos/create-todo.dto';
import { UpdateTodoDto } from '../dtos/update-todo.dto';
import { StatusEnum } from 'src/enums/status.enum';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    const todo = this.todoRepository.create(createTodoDto);
    return await this.todoRepository.save(todo);
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    Object.assign(todo, updateTodoDto);
    return await this.todoRepository.save(todo);
  }
  async updateTodo(id: number, updateData: Partial<TodoEntity>): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
  
    Object.assign(todo, updateData); // Update todo with new data
    return await this.todoRepository.save(todo);
  }
  async deleteTodo(id: number): Promise<void> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    await this.todoRepository.softRemove(todo);
  }
  async restoreTodo(id: number): Promise<void> {
    const restoreResult = await this.todoRepository.restore(id);

    if (restoreResult.affected === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found or not deleted`);
    }
  }
  async countTodosByStatus(): Promise<Record<StatusEnum, number>> {
    const counts = await this.todoRepository
      .createQueryBuilder("todo")
      .select("todo.status", "status")
      .addSelect("COUNT(todo.id)", "count")
      .groupBy("todo.status")
      .getRawMany();

    // Format results to match the StatusEnum keys
    const result = {
      [StatusEnum.IN_PROGRESS]: 0,
      [StatusEnum.COMPLETED]: 0,
      [StatusEnum.CANCELLED]: 0,
    };

    counts.forEach((entry) => {
      result[entry.status] = parseInt(entry.count, 10);
    });

    return result;
  }
  async getAllTodos(): Promise<TodoEntity[]> {
    return this.todoRepository.find();
  }
  // Méthode pour récupérer tous les todos avec pagination et filtrage
  async getAll(
    page: number = 1,   // Page par défaut 1
    limit: number = 10, // Limite par défaut 10
    name?: string,
    description?: string,
    status?: StatusEnum,
  ) {
    const query = this.todoRepository.createQueryBuilder('todo');

    // Appliquer les filtres de recherche
    if (name) {
      query.andWhere('todo.name LIKE :name', { name: `%${name}%` });
    }
    if (description) {
      query.andWhere('todo.description LIKE :description', { description: `%${description}%` });
    }
    if (status) {
      query.andWhere('todo.status = :status', { status });
    }

    // Appliquer la pagination
    query.skip((page - 1) * limit); // Calculer le décalage pour la pagination
    query.take(limit);              // Limiter le nombre de résultats par page

    const [todos, total] = await query.getManyAndCount();

    return {
      todos,
      total,
      page,
      pages: Math.ceil(total / limit), // Calculer le nombre total de pages
    };
  }
  async getTodoById(id: number): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }
  async getTodos(
    name?: string,
    description?: string,
    status?: StatusEnum,
  ): Promise<TodoEntity[]> {
    const where: any = {};

    // Vérifier si chaque critère est présent et l'ajouter à l'objet `where`
    if (name) {
      where.name = Like(`%${name}%`);
    }
    if (description) {
      where.description = Like(`%${description}%`);
    }
    if (status) {
      where.status = status;
    }

    return this.todoRepository.find({ where });
  }

}
