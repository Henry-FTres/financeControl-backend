import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDTO } from 'src/dtos/create-account-dto';
import { UpdateAccountDTO } from 'src/dtos/update-account-dto';

@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  // [LOCAL] Rota POST /api/accounts: criar conta bancária (com saldo inicial)
  @Post()
  create(@Req() req: any, @Body() dto: CreateAccountDTO) {
    return this.accountsService.create(req.user.sub, dto);
  }

  // [LOCAL] Rota GET /api/accounts: listar minhas contas
  @Get()
  findAll(@Req() req: any) {
    return this.accountsService.findAll(req.user.sub);
  }

  // [LOCAL] Rota GET /api/accounts/:id: buscar uma conta
  @Get(':id')
  findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.accountsService.findOne(req.user.sub, id);
  }

  // [LOCAL] Rota PATCH /api/accounts/:id: editar conta (o saldo não é editável)
  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAccountDTO,
  ) {
    return this.accountsService.update(req.user.sub, id, dto);
  }

  // [LOCAL] Rota DELETE /api/accounts/:id: apagar conta (e as movimentações dela)
  @Delete(':id')
  @HttpCode(204)
  remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.accountsService.remove(req.user.sub, id);
  }
}
