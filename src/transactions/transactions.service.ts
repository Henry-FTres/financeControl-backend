import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateTransactionDTO } from 'src/dtos/create-transaction-dto';
import { UpdateTransactionDTO } from 'src/dtos/update-transaction-dto';
import { Prisma, TransactionType } from '../../prisma/generated/prisma/client';

@Injectable()
export class TransactionsService {

    constructor(private prisma: PrismaService) { }

    async create(userId: number, dto: CreateTransactionDTO) {
        await this.checkAccount(userId, dto.accountId);
        if (dto.categoryId) await this.checkCategory(userId, dto.categoryId);

        return this.prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.create({
                data: {
                    accountId: dto.accountId,
                    date: new Date(dto.date),
                    amount: dto.amount,
                    transactionType: dto.transactionType,
                    description: dto.description ?? null,
                    counterparty: dto.counterparty,
                    fixed: dto.fixed ?? false,
                    categoryId: dto.categoryId ?? null,
                },
            });

            await tx.account.update({
                where: { id: dto.accountId },
                data: { balance: { increment: this.effect(dto.transactionType, dto.amount) } },
            });

            return transaction;
        });
    }

    async findAll(userId: number, accountId?: number) {
        return this.prisma.transaction.findMany({
            where: {
                account: { userId },
                ...(accountId ? { accountId } : {}),
            },
            orderBy: { date: 'desc' },
        });
    }

    async findOne(userId: number, id: number) {
        const transaction = await this.prisma.transaction.findFirst({
            where: { id, account: { userId } },
        });

        if (!transaction) {
            throw new NotFoundException('Transação não encontrada');
        }

        return transaction;
    }

    async update(userId: number, id: number, dto: UpdateTransactionDTO) {
        const old = await this.findOne(userId, id);
        if (dto.categoryId) await this.checkCategory(userId, dto.categoryId);

        // efeito antigo e novo no saldo; a conta recebe só a diferença
        const newType = dto.transactionType ?? old.transactionType;
        const newAmount = dto.amount ?? old.amount;
        const difference = this.effect(newType, newAmount).minus(this.effect(old.transactionType, old.amount));

        return this.prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.update({
                where: { id },
                data: {
                    date: dto.date ? new Date(dto.date) : undefined,
                    amount: dto.amount,
                    transactionType: dto.transactionType,
                    description: dto.description,
                    counterparty: dto.counterparty,
                    fixed: dto.fixed,
                    categoryId: dto.categoryId,
                },
            });

            await tx.account.update({
                where: { id: old.accountId },
                data: { balance: { increment: difference } },
            });

            return transaction;
        });
    }

    async remove(userId: number, id: number) {
        const old = await this.findOne(userId, id);

        await this.prisma.$transaction(async (tx) => {
            await tx.transaction.delete({ where: { id } });

            // desfaz o efeito que a transação tinha no saldo
            await tx.account.update({
                where: { id: old.accountId },
                data: { balance: { increment: this.effect(old.transactionType, old.amount).negated() } },
            });
        });
    }

    // ENTRADA soma ao saldo, SAIDA subtrai
    private effect(type: TransactionType, amount: Prisma.Decimal | number) {
        const value = new Prisma.Decimal(amount);
        return type === TransactionType.ENTRADA ? value : value.negated();
    }

    private async checkAccount(userId: number, accountId: number) {
        const account = await this.prisma.account.findFirst({
            where: { id: accountId, userId },
        });
        if (!account) throw new NotFoundException('Conta não encontrada');
    }

    // a categoria precisa ser global (sem dono) ou do próprio usuário
    private async checkCategory(userId: number, categoryId: number) {
        const category = await this.prisma.category.findFirst({
            where: { id: categoryId, OR: [{ userId: null }, { userId }] },
        });
        if (!category) throw new NotFoundException('Categoria não encontrada');
    }
}