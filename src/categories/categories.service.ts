import {
  Injectable,
  NotFoundException,
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
    return this.prisma.category.create({
      // cria category recebendo name e userId
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
