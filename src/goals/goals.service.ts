import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateGoalDTO } from 'src/dtos/create-goal-dto';
import { UpdateGoalDTO } from 'src/dtos/update-goal-dto';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {} // da acesso ao banco de dados, injetando o PrismaService

  async findAll(userId: number) {
    const goals = await this.prisma.goal.findMany({
      where: { userId: userId }, // só as metas do user logado
      orderBy: { deadline: 'asc' }, // ordena pelo prazo mais próximo da meta
    });

    return goals.map((goal) => ({
      // passa por cada meta e adiciona a propriedade achieved, que indica se a meta foi atingida ou não
      ...goal,
      achieved: goal.currentAmount.gte(goal.targetAmount), // greater than or equal to, compara se o valor atual é maior ou igual ao valor alvo
    }));
  }

  async create(userId: number, dto: CreateGoalDTO) {
    const deadline = new Date(dto.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (deadline < today) {
      // não permite criar meta com prazo no passado
      throw new BadRequestException('O prazo da meta não pode ser no passado');
    }

    return this.prisma.goal.create({
      data: {
        targetAmount: dto.targetAmount,
        deadline: deadline,
        description: dto.description,
        userId: userId,
      },
    });
  }

  async update(userId: number, id: number, dto: UpdateGoalDTO) {
    const goal = await this.prisma.goal.findFirst({
      // busca a meta pelo id e userId
      where: { id: id, userId: userId },
    });

    if (!goal) {
      // se não encontrar a meta, lança NotFoundException
      throw new NotFoundException('Meta não encontrada');
    }

    let deadline: Date | undefined = undefined;

    if (dto.deadline) {
      // só valida o prazo se ele foi enviado
      deadline = new Date(dto.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadline < today) {
        // não permite mudar o prazo para o passado
        throw new BadRequestException(
          'O prazo da meta não pode ser no passado',
        );
      }
    }

    return this.prisma.goal.update({
      // atualiza a meta com os novos dados
      where: { id: id },
      data: {
        targetAmount: dto.targetAmount,
        currentAmount: dto.currentAmount,
        deadline: deadline,
        description: dto.description,
      },
    });
  }

  async delete(userId: number, id: number) {
    const goal = await this.prisma.goal.findFirst({
      // busca a meta pelo id e userId
      where: { id: id, userId: userId },
    });

    if (!goal) {
      // se não encontrar a meta, lança NotFoundException
      throw new NotFoundException('Meta não encontrada');
    }

    return this.prisma.goal.delete({
      // deleta a meta
      where: { id: id },
    });
  }
}
