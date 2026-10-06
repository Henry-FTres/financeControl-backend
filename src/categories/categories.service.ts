import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCategoryDTO } from 'src/dtos/create-category-dto';
import { UpdateCategoryDTO } from 'src/dtos/update-category-dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.category.findMany({
      // busca todas as categorias do usuário, ou as categorias globais (userId = null)
      where: {
        OR: [{ userId: null }, { userId: userId }],
      },
      orderBy: { name: 'asc' },
    });
  }

  async create(userId: number, dto: CreateCategoryDTO) {
    const existing = await this.prisma.category.findFirst({
      // procura uma categoria com o mesmo nome, entre as padrão e as do usuário
      where: {
        name: dto.name,
        OR: [{ userId: null }, { userId: userId }],
      },
    });

    if (existing) {
      // se já existir, recusa com erro 409
      throw new ConflictException('Já existe uma categoria com esse nome');
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        userId: userId,
      },
    });
  }

  async update(userId: number, id: number, dto: UpdateCategoryDTO) {
    const category = await this.prisma.category.findFirst({
      // busca a categoria pelo id e userId
      where: { id: id, userId: userId },
    });

    if (!category) {
      // se não encontrar a categoria, lança NotFoundException
      throw new NotFoundException('Categoria não encontrada');
    }

    const existing = await this.prisma.category.findFirst({
      // procura outra categoria com o mesmo nome, entre as padrão e as do usuário
      where: {
        name: dto.name,
        id: { not: id },
        OR: [{ userId: null }, { userId: userId }],
      },
    });

    if (existing) {
      // se já existir outra com esse nome, recusa com erro 409
      throw new ConflictException('Já existe uma categoria com esse nome');
    }

    return this.prisma.category.update({
      // atualiza a categoria com o novo name
      where: { id: id },
      data: { name: dto.name },
    });
  }

  async delete(userId: number, id: number) {
    const category = await this.prisma.category.findFirst({
      // busca a categoria pelo id e userId
      where: { id: id, userId: userId },
    });

    if (!category) {
      // se não encontrar a categoria, lança NotFoundException
      throw new NotFoundException('Categoria não encontrada');
    }

    return this.prisma.category.delete({
      // deleta a categoria
      where: { id: id },
    });
  }
}
