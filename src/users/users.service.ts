import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDTO } from 'src/dtos/create-user-dto';
import bcrypt from 'bcryptjs';
import { PersonType } from '../../prisma/generated/prisma/client';
import { UpdateUserDTO } from 'src/dtos/update-user-dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDTO) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const isFisica = dto.personType === PersonType.FISICA;

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
  }

  async updateUser(id: number, dto: UpdateUserDTO): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (dto.legalName && user?.personType !== 'JURIDICA') {
      // so permite mudar legalName se for pessoa jurídica
      throw new BadRequestException(
        'Apenas pessoa jurídica pode alterar a razão social',
      );
    }

    if (dto.birthDate && user?.personType !== 'FISICA') {
      // so permite mudar birthDate se for pessoa física
      throw new BadRequestException(
        'Apenas pessoa física pode alterar a data de nascimento',
      );
    }

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
}
