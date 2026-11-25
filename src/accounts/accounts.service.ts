import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateAccountDTO } from 'src/dtos/create-account-dto';
import { UpdateAccountDTO } from 'src/dtos/update-account-dto';
import { Prisma } from '../../prisma/generated/prisma/client';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  // [LOCAL] Criar conta: o dono é sempre o usuário do token
  async create(userId: number, dto: CreateAccountDTO) {
    try {
      return await this.prisma.account.create({
        data: {
          accountNumber: dto.accountNumber,
          institution: dto.institution,
          pixKey: dto.pixKey ?? null,
          accountType: dto.accountType,
          balance: dto.balance,
          userId: userId,
        },
      });
    } catch (e) {
      this.handleDuplicate(e);
    }
  }

  // [LOCAL] Listar contas do usuário, em ordem alfabética de instituição
  async findAll(userId: number) {
    return this.prisma.account.findMany({
      where: { userId },
      orderBy: { institution: 'asc' },
    });
  }

  // [LOCAL] Buscar uma conta: só encontra se for do usuário logado (senão, 404)
  async findOne(userId: number, id: number) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
    });

    if (!account) {
      throw new NotFoundException('Conta não encontrada');
    }

    return account;
  }

  // [LOCAL] Editar conta: o campo balance (saldo) fica de fora de propósito
  async update(userId: number, id: number, dto: UpdateAccountDTO) {
    await this.findOne(userId, id); // garante que a conta existe e é do usuário

    try {
      return await this.prisma.account.update({
        where: { id },
        data: {
          accountNumber: dto.accountNumber,
          institution: dto.institution,
          pixKey: dto.pixKey,
          accountType: dto.accountType,
        },
      });
    } catch (e) {
      this.handleDuplicate(e);
    }
  }

  // [LOCAL] Apagar conta
  async remove(userId: number, id: number) {
    await this.findOne(userId, id); // garante que a conta existe e é do usuário

    await this.prisma.account.delete({
      where: { id },
    });
  }

  // traduz o erro de duplicidade do banco (número + instituição repetidos) em uma resposta clara
  // [LOCAL] Erro 409: conta com o mesmo número na mesma instituição
  private handleDuplicate(e: unknown): never {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      throw new ConflictException(
        'Já existe uma conta com esse número nessa instituição',
      );
    }
    throw e;
  }
}
