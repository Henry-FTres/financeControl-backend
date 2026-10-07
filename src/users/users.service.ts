import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDTO } from 'src/dtos/create-user-dto';
import bcrypt from 'bcryptjs';
import { Prisma, PersonType } from '../../prisma/generated/prisma/client';
import { UpdateUserDTO } from 'src/dtos/update-user-dto';
import { ChangePasswordDTO } from 'src/dtos/change-password-dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDTO) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const isFisica = dto.personType === PersonType.FISICA;

    try {
      return await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          personType: dto.personType,
          // dados de pessoa física: só salvos se for PF
          cpf: isFisica ? dto.cpf : null,
          birthDate: isFisica && dto.birthDate ? new Date(dto.birthDate) : null,
          // dados de pessoa jurídica: só salvos se for PJ
          cnpj: !isFisica ? dto.cnpj : null,
          legalName: !isFisica ? dto.legalName : null,
          phone: dto.phone ?? null,
          passwordHash: passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
          personType: true,
          createdAt: true,
        },
      });
    } catch (e) {
      this.handleDuplicate(e);
    }
  }

  async updateUser(id: number, dto: UpdateUserDTO): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      // se o usuário não existir, lança NotFoundException
      throw new NotFoundException('Usuário não encontrado');
    }

    if (dto.legalName && user.personType !== 'JURIDICA') {
      // so permite mudar legalName se for pessoa jurídica
      throw new BadRequestException(
        'Apenas pessoa jurídica pode alterar a razão social',
      );
    }

    if (dto.birthDate && user.personType !== 'FISICA') {
      // so permite mudar birthDate se for pessoa física
      throw new BadRequestException(
        'Apenas pessoa física pode alterar a data de nascimento',
      );
    }

    try {
      await this.prisma.user.update({
        where: { id },
        data: {
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          legalName: dto.legalName,
          birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        },
      });
    } catch (e) {
      // trata email repetido ao alterar
      this.handleDuplicate(e);
    }
  }

  async changePassword(id: number, dto: ChangePasswordDTO): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      // se o usuário não existir, lança NotFoundException
      throw new NotFoundException('Usuário não encontrado');
    }

    // compara a senha atual com a senha armazenada no banco de dados
    const ok = await bcrypt.compare(dto.currentPassword, user.passwordHash);

    if (!ok) {
      // se a senha atual estiver errada, recusa
      throw new BadRequestException('Senha atual incorreta');
    }

    // criptografa a nova senha antes de salvar
    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      // salva a nova senha já criptografada
      where: { id },
      data: { passwordHash: passwordHash },
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        personType: true,
        cpf: true,
        birthDate: true,
        cnpj: true,
        legalName: true,
        phone: true,
        createdAt: true,
      },
    });
  }

  // traduz o erro de duplicidade do banco em uma resposta clara
  private handleDuplicate(e: unknown): never {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      throw new ConflictException(
        'Já existe um usuário com esse email, CPF ou CNPJ',
      );
    }
    throw e;
  }
}
