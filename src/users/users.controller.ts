import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDTO } from 'src/dtos/create-user-dto';
import { UsersService } from './users.service';
import { UpdateUserDTO } from 'src/dtos/update-user-dto';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Post()
  async create(@Body() body: CreateUserDTO) {
    //chamar o service aqui
    await this.service.createUser(body);
  }

  @Get('me')
  async findMe(@Req() req: any) {
    return await this.service.findById(req.user.sub);
  }

  @Put('me')
  async update(@Req() req: any, @Body() body: UpdateUserDTO) {
    await this.service.updateUser(req.user.sub, body);
  }

  @Delete('me')
  async delete(@Req() req: any) {
    await this.service.deleteUser(req.user.sub);
  }
}
